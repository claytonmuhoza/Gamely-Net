using GamePlatform.Application.Games.Morpion;
using GamePlatform.Application.Games.Puissance4;
using GamePlatform.Application.Games.SpeedTyping;
using GamePlatform.Contracts.Games;
using GamePlatform.Contracts.Games.SpeedTyping;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.Web.Hubs;

public sealed class GameHub : Hub
{
    private readonly PlayMorpionMoveHandler _morpion;
    private readonly DropPuissance4DiscHandler _puissance4;
    private readonly UpdateSpeedTypingProgressHandler  _speedTyping;
    public GameHub(PlayMorpionMoveHandler morpion, DropPuissance4DiscHandler puissance4,  UpdateSpeedTypingProgressHandler speedTyping)
    {
        _morpion = morpion;
        _puissance4 = puissance4;
        _speedTyping = speedTyping;
    }

    public Task SubscribeGame(Guid lobbyId)
        => Groups.AddToGroupAsync(Context.ConnectionId, $"game-{lobbyId}");

    public Task UnsubscribeGame(Guid lobbyId)
        => Groups.RemoveFromGroupAsync(Context.ConnectionId, $"game-{lobbyId}");

    // Option "full realtime" : jouer via SignalR plutôt que REST
    public Task PlayMorpionMove(Guid lobbyId, PlayMorpionMoveRequest request)
        => _morpion.Handle(lobbyId, request, Context.ConnectionAborted);
    public Task DropPuissance4(Guid lobbyId, DropPuissance4DiscRequest request)
        => _puissance4.Handle(lobbyId, request, Context.ConnectionAborted);
    public Task UpdateSpeedTypingProgress(Guid lobbyId, UpdateSpeedTypingProgressRequest request)
        => _speedTyping.Handle(lobbyId, request, Context.ConnectionAborted);
}