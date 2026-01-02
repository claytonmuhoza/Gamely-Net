using System.Text.Json;
using GamePlatform.Application.Games.Logs;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Realtime;
using GamePlatform.Contracts.Games;
using GamePlatform.Domain;

namespace GamePlatform.Application.Games.Morpion;


public sealed class PlayMorpionMoveHandler
{
    private readonly IGameSessionRepository _sessions;
    private readonly ILobbyRepository _lobbies;
    private readonly IGameNotifier _notifier;
    private readonly IGameActionLogger _actionLogger;
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public PlayMorpionMoveHandler(
        IGameSessionRepository sessions,
        ILobbyRepository lobbies,
        IGameNotifier notifier,
        IGameActionLogger actionLogger)
    {
        _sessions = sessions;
        _lobbies = lobbies;
        _notifier = notifier;
        _actionLogger = actionLogger;
    }

    public async Task Handle(Guid lobbyId, PlayMorpionMoveRequest req, CancellationToken ct)
    {
        if (req.ClientId == Guid.Empty) throw new ArgumentException("ClientId is required");
        if (req.Index < 0 || req.Index > 8) throw new ArgumentException("Index must be 0..8");

        var session = await _sessions.GetByLobbyIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Game session not found");

        if (session.GameId != GameId.Morpion)
            throw new InvalidOperationException("Not a Morpion game");

        var lobby = await _lobbies.GetByIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Lobby not found");

        var snapshot = JsonSerializer.Deserialize<MorpionSnapshot>(session.StateJson)
            ?? throw new InvalidOperationException("Invalid state");

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
        session.StateJson = JsonSerializer.Serialize(newSnapshot);
        await _sessions.SaveChangesAsync(ct);
        await _actionLogger.LogAsync(
            session.Id,
            actionType:"MORPION_MOVE",
            payloadJson: JsonSerializer.Serialize(new { req.ClientId, req.Index }),
            req.ClientId,
            ct);
      
        var pseudoX = lobby.Players.First(p => p.ClientId == newSnapshot.PlayerX).Pseudo;
        var pseudoO = lobby.Players.First(p => p.ClientId == newSnapshot.PlayerO).Pseudo;

        var dto = MorpionMapper.ToDto(lobbyId, newSnapshot, pseudoX, pseudoO);
        await _actionLogger.LogAsync(
            session.Id,
            actionType: GameActionTypes.StateSnapshot,
            payloadJson: JsonSerializer.Serialize(dto, JsonOpts),
            actorClientId: req.ClientId,
            ct);
        await _notifier.NotifyGameStateUpdated(lobbyId, dto, ct);
    }
}
