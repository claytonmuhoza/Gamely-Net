using System.Text.Json;
using GamePlatform.Application.Games.Logs;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Realtime;
using GamePlatform.Application.Scores;
using GamePlatform.Contracts.Games;
using GamePlatform.Domain;

namespace GamePlatform.Application.Games.Morpion;

public sealed class PlayMorpionMoveHandler
{
    private readonly IGameSessionRepository _sessions;
    private readonly ILobbyRepository _lobbies;
    private readonly IGameNotifier _notifier;
    private readonly IGameActionLogger _actionLogger;
    private readonly ScoreService _scores;

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public PlayMorpionMoveHandler(
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

    public async Task Handle(Guid lobbyId, PlayMorpionMoveRequest req, CancellationToken ct)
    {
        if (req.ClientId == Guid.Empty) throw new ArgumentException("ClientId is required");
        if (req.Index < 0 || req.Index > 8) throw new ArgumentException("Index must be 0..8");

        var session = await _sessions.GetByLobbyIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Game session not found");

        if (session.GameId != GameId.Morpion)
            throw new InvalidOperationException("Not a Morpion game");

        // Si déjà fini, on ignore (idempotent / anti double score)
        if (session.Phase != GamePhase.Running)
            return;

        var lobby = await _lobbies.GetByIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Lobby not found");

        var snapshot = JsonSerializer.Deserialize<MorpionSnapshot>(session.StateJson, JsonOpts)
            ?? throw new InvalidOperationException("Invalid state");

        // Pour détecter la transition "vient de finir"
        var wasFinishedBefore = snapshot.Winner is not null || snapshot.IsDraw;

        var game = MorpionMapper.ToDomain(lobbyId, snapshot);

        try
        {
            game.PlayMove(req.ClientId, req.Index);
        }
        catch (Exception ex)
        {
            await _notifier.NotifyCommandRejected(lobbyId, ex.Message, ct);
            return;
        }

        var newSnapshot = MorpionMapper.ToSnapshot(game);

        // ✅ Fin de partie
        var isFinishedNow = newSnapshot.Winner is not null || newSnapshot.IsDraw;
        var justFinished = !wasFinishedBefore && isFinishedNow;

        if (justFinished)
        {
            session.Phase = GamePhase.Finished;
            session.EndedAt = DateTimeOffset.UtcNow;

            if (newSnapshot.Winner is Guid winnerId)
            {
                var winnerPseudo = lobby.Players.First(p => p.ClientId == winnerId).Pseudo;

                // 1 point au gagnant (vous pouvez ajuster)
                await _scores.AddScoreAsync(
                    gameId: GameId.Morpion,
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

        // Logs action (move)
        await _actionLogger.LogAsync(
            session.Id,
            actionType: "MORPION_MOVE",
            payloadJson: JsonSerializer.Serialize(new { req.ClientId, req.Index }, JsonOpts),
            actorClientId: req.ClientId,
            ct: ct
        );

        // DTO
        var pseudoX = lobby.Players.First(p => p.ClientId == newSnapshot.PlayerX).Pseudo;
        var pseudoO = lobby.Players.First(p => p.ClientId == newSnapshot.PlayerO).Pseudo;

        var dto = MorpionMapper.ToDto(lobbyId, newSnapshot, pseudoX, pseudoO);

        // Snapshot log (replay)
        await _actionLogger.LogAsync(
            session.Id,
            actionType: GameActionTypes.StateSnapshot,
            payloadJson: JsonSerializer.Serialize(dto, JsonOpts),
            actorClientId: req.ClientId,
            ct: ct
        );

        await _notifier.NotifyGameStateUpdated(lobbyId, dto, ct);
    }
}
