using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Realtime;
using GamePlatform.Contracts.Realtime;
using GamePlatform.Web.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.Web.Realtime;

public sealed class LobbyNotifier : ILobbyNotifier
{
    private readonly IHubContext<LobbyHub> _hub;
    private readonly ListWaitingLobbiesHandler _listHandler;
    private readonly GetLobbyDetailsHandler _detailsHandler;

    public LobbyNotifier(
        IHubContext<LobbyHub> hub,
        ListWaitingLobbiesHandler listHandler,
        GetLobbyDetailsHandler detailsHandler)
    {
        _hub = hub;
        _listHandler = listHandler;
        _detailsHandler = detailsHandler;
    }

    public async Task NotifyLobbyListUpdated(CancellationToken ct)
    {
        var list = await _listHandler.Handle(ct);
        await _hub.Clients.Group("lobby-list")
            .SendAsync(LobbyRealtimeEvents.LobbyListUpdated, list, ct);
    }

    public async Task NotifyLobbyUpdated(Guid lobbyId, CancellationToken ct)
    {
        var lobby = await _detailsHandler.Handle(lobbyId, ct);
        await _hub.Clients.Group($"lobby-{lobbyId}")
            .SendAsync(LobbyRealtimeEvents.LobbyUpdated, lobby, ct);
    }
}