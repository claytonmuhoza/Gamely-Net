using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.Web.Hubs;

public sealed class LobbyHub : Hub
{
    public Task SubscribeLobbyList()
        => Groups.AddToGroupAsync(Context.ConnectionId, "lobby-list");

    public Task UnsubscribeLobbyList()
        => Groups.RemoveFromGroupAsync(Context.ConnectionId, "lobby-list");

    public Task SubscribeLobby(Guid lobbyId)
        => Groups.AddToGroupAsync(Context.ConnectionId, $"lobby-{lobbyId}");

    public Task UnsubscribeLobby(Guid lobbyId)
        => Groups.RemoveFromGroupAsync(Context.ConnectionId, $"lobby-{lobbyId}");
}