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

        if (nowMs - runner.LastUpdateUnixMs < snapshot.MinUpdateIntervalMs)
        {
            await _notifier.NotifyCommandRejected(lobbyId, "Too many updates", ct);
            return;
        }

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

        // ✅ Mettre à jour l'anti-spam sur le snapshot AVANT save
        runner.LastUpdateUnixMs = nowMs;

        // ✅ Mettre à jour snapshot à partir du domain
        foreach (var r in snapshot.Runners)
        {
            var dom = race.Runners.First(x => x.ClientId == r.ClientId);
            r.Progress = dom.Progress;
            r.FinishedAtUnixMs = dom.FinishedAt?.ToUnixTimeMilliseconds();
            // LastUpdateUnixMs : on garde celui existant (et on a mis celui de l'acteur)
        }

        snapshot.EndedAtUnixMs = race.IsFinished ? nowMs : (long?)null;

        // ✅ Enregistrer score si le joueur vient de finir (détecter la transition)
        var justFinished = runner.FinishedAtUnixMs is null && race.Runners.First(x => x.ClientId == req.ClientId).FinishedAt is not null;
        if (justFinished)
        {
            runner.FinishedAtUnixMs = nowMs;
            var elapsedMs = nowMs - snapshot.StartedAtUnixMs;

            await _scores.AddScoreAsync(
                GameId.SpeedTyping,
                req.ClientId,
                runner.Pseudo,
                elapsedMs,
                ct);
        }

        // Persist state
        session.StateJson = JsonSerializer.Serialize(snapshot, JsonOpts);
        await _sessions.SaveChangesAsync(ct);

        // ✅ Log action (throttle simple) + snapshot
        if (req.Progress % 5 == 0) // évite de spammer
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
