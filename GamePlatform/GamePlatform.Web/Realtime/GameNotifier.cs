using GamePlatform.Application.Realtime;
using GamePlatform.Contracts.Realtime;
using GamePlatform.Web.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.Web.Realtime;

public sealed class GameNotifier : IGameNotifier
{
    private readonly IHubContext<GameHub> _hub;

    public GameNotifier(IHubContext<GameHub> hub) => _hub = hub;

    public Task NotifyGameStateUpdated(Guid lobbyId, object gameStateDto, CancellationToken ct)
        => _hub.Clients.Group($"game-{lobbyId}")
            .SendAsync(GameRealtimeEvents.GameStateUpdated, gameStateDto, ct);

    public Task NotifyCommandRejected(Guid lobbyId, string reason, CancellationToken ct)
        => _hub.Clients.Group($"game-{lobbyId}")
            .SendAsync(GameRealtimeEvents.CommandRejected, new { reason }, ct);
}