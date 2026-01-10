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
        if (req.ClientId == Guid.Empty) throw new ArgumentException("ClientId is required");
        if (req.Progress < 0 || req.Progress > 100) throw new ArgumentException("Progress must be 0..100");

        var session = await _sessions.GetByLobbyIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Game session not found");

        if (session.GameId != GameId.SpeedTyping)
            throw new InvalidOperationException("Not a SpeedTyping game");

        if (session.Phase != GamePhase.Running)
            return; // idempotent: si déjà fini, on ignore

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

        //  anti-spam
        if (nowMs - runner.LastUpdateUnixMs < snapshot.MinUpdateIntervalMs)
        {
            await _notifier.NotifyCommandRejected(lobbyId, "Too many updates", ct);
            return;
        }

        //  Important : capturer l’état "avant"
        var wasFinishedBefore = runner.FinishedAtUnixMs is not null;

        // Domain
        var race = SpeedTypingMapper.ToDomain(lobbyId, snapshot);

        try
        {
            race.UpdateProgress(req.ClientId, req.Progress, DateTimeOffset.UtcNow);
        }
        catch (Exception ex)
        {
            await _notifier.NotifyCommandRejected(lobbyId, ex.Message, ct);
            return;
        }

        //  mettre à jour anti-spam pour l'acteur
        runner.LastUpdateUnixMs = nowMs;

        //  réinjecter domain -> snapshot
        foreach (var r in snapshot.Runners)
        {
            var dom = race.Runners.First(x => x.ClientId == r.ClientId);
            r.Progress = dom.Progress;
            r.FinishedAtUnixMs = dom.FinishedAt?.ToUnixTimeMilliseconds();
        }

        // transition "vient de finir" (après update domain)
        var isFinishedNow = runner.FinishedAtUnixMs is not null || req.Progress >= 100;
        var justFinished = !wasFinishedBefore && isFinishedNow;

        if (justFinished)
        {
            // force un timestamp propre (au cas où domain ne l’a pas fixé)
            runner.FinishedAtUnixMs ??= nowMs;

            // score = temps écoulé
            var elapsedMs = runner.FinishedAtUnixMs.Value - snapshot.StartedAtUnixMs;

            await _scores.AddScoreAsync(
                gameId: GameId.SpeedTyping,
                clientId: req.ClientId,
                pseudo: runner.Pseudo,
                value: elapsedMs,
                lobbyId: lobbyId,
                gameSessionId: session.Id,
                ct: ct
            );
        }

        //  règle: dès qu'un joueur termine, la course se termine
        var raceEnded = snapshot.Runners.Any(r => r.FinishedAtUnixMs is not null);
        if (raceEnded)
        {
            snapshot.EndedAtUnixMs ??= nowMs;
            session.Phase = GamePhase.Finished;
            session.EndedAt = DateTimeOffset.UtcNow;
        }

        // Persist
        session.StateJson = JsonSerializer.Serialize(snapshot, JsonOpts);
        await _sessions.SaveChangesAsync(ct);

        // Logs
        if (req.Progress % 5 == 0 || justFinished)
        {
            await _actionLogger.LogAsync(
                session.Id,
                GameActionTypes.SpeedProgress,
                JsonSerializer.Serialize(new { req.ClientId, req.Progress }, JsonOpts),
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
