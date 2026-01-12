using System.Text.Json;
using GamePlatform.Application.Games.Logs;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Realtime;
using GamePlatform.Application.Scores;
using GamePlatform.Contracts.Games.SpeedTyping;
using GamePlatform.Domain;

namespace GamePlatform.Application.Games.SpeedTyping;

public sealed class UpdateSpeedTypingProgressHandler
{
    private readonly IGameSessionRepository _sessions;
    private readonly ILobbyRepository _lobbies;
    private readonly IGameNotifier _notifier;
    private readonly IGameActionLogger _actionLogger;
    private readonly ScoreService _scores;

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public UpdateSpeedTypingProgressHandler(
        IGameSessionRepository sessions,
        ILobbyRepository lobbies,
        IGameNotifier notifier,
        IGameActionLogger actionLogger,
        ScoreService scores)
    {
        _sessions = sessions;
        _lobbies = lobbies;
        _notifier = notifier;
        _actionLogger = actionLogger;
        _scores = scores;
    }

    public async Task Handle(Guid lobbyId, UpdateSpeedTypingProgressRequest req, CancellationToken ct)
    {
        if (req.ClientId == Guid.Empty) 
            throw new ArgumentException("ClientId is required");
        
        if (req.TypedText is null)
            throw new ArgumentException("TypedText is required");

        var session = await _sessions.GetByLobbyIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Game session not found");

        if (session.GameId != GameId.SpeedTyping)
            throw new InvalidOperationException("Not a SpeedTyping game");

        if (session.Phase != GamePhase.Running)
            return; // Idempotent : si déjà fini, on ignore

        var lobby = await _lobbies.GetByIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Lobby not found");

        var snapshot = JsonSerializer.Deserialize<SpeedTypingSnapshot>(session.StateJson, JsonOpts)
            ?? throw new InvalidOperationException("Invalid state");

        var nowMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        var runner = snapshot.Runners.FirstOrDefault(r => r.ClientId == req.ClientId);
        if (runner is null)
        {
            await _notifier.NotifyCommandRejected(lobbyId, "Player not in race", ct);
            return;
        }

        // Anti-spam
        if (nowMs - runner.LastUpdateUnixMs < snapshot.MinUpdateIntervalMs)
        {
            await _notifier.NotifyCommandRejected(lobbyId, "Too many updates", ct);
            return;
        }

        // Validation : le texte ne peut pas être plus long que le texte cible
        if (req.TypedText.Length > snapshot.Text.Length)
        {
            await _notifier.NotifyCommandRejected(lobbyId, "Typed text is too long", ct);
            return;
        }

        // Important : capturer l'état "avant"
        var wasFinishedBefore = runner.FinishedAtUnixMs is not null;

        // Domain : utiliser la logique métier
        var race = SpeedTypingMapper.ToDomain(lobbyId, snapshot);

        try
        {
            race.UpdateTypedText(req.ClientId, req.TypedText, DateTimeOffset.UtcNow);
        }
        catch (Exception ex)
        {
            await _notifier.NotifyCommandRejected(lobbyId, ex.Message, ct);
            return;
        }

        // Mettre à jour l'anti-spam pour l'acteur
        runner.LastUpdateUnixMs = nowMs;

        // ✅ CORRECTION: Réinjecter domain -> snapshot AVEC calcul de précision en temps réel
        foreach (var r in snapshot.Runners)
        {
            var dom = race.Runners.First(x => x.ClientId == r.ClientId);
            r.TypedText = dom.TypedText;
            r.CorrectChars = dom.CorrectChars;
            r.ErrorCount = dom.ErrorCount;
            r.WPM = dom.WPM;
            
            // ✅ NOUVEAU: Calculer la précision en temps réel (pas seulement à la fin)
            if (dom.TypedText.Length > 0)
            {
                r.Accuracy = Math.Round(((double)(dom.TypedText.Length - dom.ErrorCount) / dom.TypedText.Length) * 100, 2);
            }
            else
            {
                r.Accuracy = 100.0; // Aucun caractère tapé = 100% (pas encore d'erreur)
            }
            
            r.FinishedAtUnixMs = dom.FinishedAt?.ToUnixTimeMilliseconds();
        }

        // Transition "vient de finir"
        var isFinishedNow = runner.FinishedAtUnixMs is not null;
        var justFinished = !wasFinishedBefore && isFinishedNow;

        if (justFinished)
        {
            // Force un timestamp propre
            runner.FinishedAtUnixMs ??= nowMs;

            // Score = combinaison de WPM et précision
            // Plus le score est élevé, mieux c'est
            // Formule : WPM * (Accuracy/100) pour pénaliser les erreurs
            var score = (long)(runner.WPM * (runner.Accuracy / 100.0) * 100);

            await _scores.AddScoreAsync(
                gameId: GameId.SpeedTyping,
                clientId: req.ClientId,
                pseudo: runner.Pseudo,
                value: score,
                lobbyId: lobbyId,
                gameSessionId: session.Id,
                ct: ct
            );
        }

        // Règle : la course se termine quand le premier joueur finit
        var anyoneFinished = snapshot.Runners.Any(r => r.FinishedAtUnixMs is not null);
        if (anyoneFinished && snapshot.EndedAtUnixMs is null)
        {
            snapshot.EndedAtUnixMs = snapshot.Runners
                .Where(r => r.FinishedAtUnixMs is not null)
                .Min(r => r.FinishedAtUnixMs!.Value);
            
            session.Phase = GamePhase.Finished;
            session.EndedAt = DateTimeOffset.UtcNow;
        }

        // Persist
        session.StateJson = JsonSerializer.Serialize(snapshot, JsonOpts);
        await _sessions.SaveChangesAsync(ct);

        // Logs : on log toutes les 10 caractères ou quand quelqu'un finit
        if (req.TypedText.Length % 10 == 0 || justFinished)
        {
            await _actionLogger.LogAsync(
                session.Id,
                GameActionTypes.SpeedProgress,
                JsonSerializer.Serialize(new 
                { 
                    req.ClientId, 
                    TextLength = req.TypedText.Length,
                    CorrectChars = runner.CorrectChars,
                    Errors = runner.ErrorCount,
                    Accuracy = runner.Accuracy
                }, JsonOpts),
                req.ClientId,
                ct);
        }

        var dto = SpeedTypingMapper.ToDto(lobbyId, snapshot);

        await _actionLogger.LogAsync(
            session.Id,
            GameActionTypes.StateSnapshot,
            JsonSerializer.Serialize(dto, JsonOpts),
            req.ClientId,
            ct);

        await _notifier.NotifyGameStateUpdated(lobbyId, dto, ct);
    }
}