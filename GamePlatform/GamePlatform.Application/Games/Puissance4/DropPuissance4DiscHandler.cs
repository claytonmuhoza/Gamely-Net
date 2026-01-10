using System.Text.Json;
using GamePlatform.Application.Games.Logs;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Realtime;
using GamePlatform.Application.Scores;
using GamePlatform.Contracts.Games;
using GamePlatform.Domain;

namespace GamePlatform.Application.Games.Puissance4;

public sealed class DropPuissance4DiscHandler
{
    private readonly IGameSessionRepository _sessions;
    private readonly ILobbyRepository _lobbies;
    private readonly IGameNotifier _notifier;
    private readonly IGameActionLogger _actionLogger;
    private readonly ScoreService _scores;

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public DropPuissance4DiscHandler(
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

    public async Task Handle(Guid lobbyId, DropPuissance4DiscRequest req, CancellationToken ct)
    {
        if (req.ClientId == Guid.Empty) throw new ArgumentException("ClientId is required");
        if (req.Column < 0 || req.Column > 6) throw new ArgumentException("Column must be 0..6");

        var session = await _sessions.GetByLobbyIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Game session not found");

        if (session.GameId != GameId.Puissance4)
            throw new InvalidOperationException("Not a Puissance4 game");

        // Si déjà fini, on ignore
        if (session.Phase != GamePhase.Running)
            return;

        var lobby = await _lobbies.GetByIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Lobby not found");

        var snapshot = JsonSerializer.Deserialize<Puissance4Snapshot>(session.StateJson, JsonOpts)
            ?? throw new InvalidOperationException("Invalid state");

        var wasFinishedBefore = snapshot.Winner is not null || snapshot.IsDraw;

        var game = Puissance4Mapper.ToDomain(lobbyId, snapshot);

        try
        {
            game.Drop(req.ClientId, req.Column);
        }
        catch (Exception ex)
        {
            await _notifier.NotifyCommandRejected(lobbyId, ex.Message, ct);
            return;
        }

        var newSnapshot = Puissance4Mapper.ToSnapshot(game);

        var isFinishedNow = newSnapshot.Winner is not null || newSnapshot.IsDraw;
        var justFinished = !wasFinishedBefore && isFinishedNow;

        if (justFinished)
        {
            session.Phase = GamePhase.Finished;
            session.EndedAt = DateTimeOffset.UtcNow;

            if (newSnapshot.Winner is Guid winnerId)
            {
                var winnerPseudo = lobby.Players.First(p => p.ClientId == winnerId).Pseudo;

                await _scores.AddScoreAsync(
                    gameId: GameId.Puissance4,
                    clientId: winnerId,
                    pseudo: winnerPseudo,
                    value: 1,
                    lobbyId: lobbyId,
                    gameSessionId: session.Id,
                    ct: ct
                );
            }
        }

        session.StateJson = JsonSerializer.Serialize(newSnapshot, JsonOpts);
        await _sessions.SaveChangesAsync(ct);

        // Action log (drop)
        await _actionLogger.LogAsync(
            session.Id,
            GameActionTypes.Puissance4Drop,
            JsonSerializer.Serialize(new { req.ClientId, req.Column }, JsonOpts),
            req.ClientId,
            ct);

        // DTO + snapshot log + notify
        var pseudoR = lobby.Players.First(p => p.ClientId == newSnapshot.PlayerRed).Pseudo;
        var pseudoY = lobby.Players.First(p => p.ClientId == newSnapshot.PlayerYellow).Pseudo;

        var dto = Puissance4Mapper.ToDto(lobbyId, newSnapshot, pseudoR, pseudoY);

        await _actionLogger.LogAsync(
            session.Id,
            GameActionTypes.StateSnapshot,
            JsonSerializer.Serialize(dto, JsonOpts),
            req.ClientId,
            ct);

        await _notifier.NotifyGameStateUpdated(lobbyId, dto, ct);
    }
}
