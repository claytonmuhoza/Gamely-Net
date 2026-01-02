using GamePlatform.Application.Lobbies;
using GamePlatform.Contracts.Games.Logs;
using GamePlatform.Domain;

namespace GamePlatform.Application.Games.Logs;

public sealed class GetGameActionLogsHandler
{
    private readonly IGameSessionRepository _sessions;
    private readonly IGameActionLogRepository _logs;
    private readonly ILobbyRepository _lobbies;

    public GetGameActionLogsHandler(IGameSessionRepository sessions, IGameActionLogRepository logs, ILobbyRepository lobbies)
    {
        _sessions = sessions;
        _logs = logs;
        _lobbies = lobbies;
    }

    public async Task<List<GameActionLogDto>> Handle(Guid lobbyId, CancellationToken ct)
    {
        var session = await _sessions.GetByLobbyIdAsync(lobbyId, ct)
                      ?? throw new KeyNotFoundException("Game session not found");

        var lobby = await _lobbies.GetByIdAsync(lobbyId, ct)
                    ?? throw new KeyNotFoundException("Lobby not found");

        var items = await _logs.ListBySessionIdAsync(session.Id, ct);

        return items
            .OrderBy(x => x.At)
            .Select(x => new GameActionLogDto(
                Id: x.Id,
                LobbyId: lobby.Id,
                GameSessionId: session.Id,
                GameId: session.GameId.ToString(),
                ActionType: x.ActionType,
                PayloadJson: x.PayloadJson,
                ActorClientId: x.ActorClientId,
                At: x.At
            ))
            .ToList();
    }
}