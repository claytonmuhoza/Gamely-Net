using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.Puissance;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.API.Hubs;

public class PuissanceHub : Hub
{
    private readonly IPuissanceGameService _puissanceGameService;

    public PuissanceHub(IPuissanceGameService puissanceGameService)
    {
        _puissanceGameService = puissanceGameService;
    }

    public async Task StartGame(Guid lobbyId, Guid player1Id, Guid player2Id, CancellationToken cancellationToken)
    {
        try
        {
            var game = await _puissanceGameService.CreateAsync(lobbyId, player1Id, player2Id, cancellationToken);
            await Clients.Caller.SendAsync("GameStarted", game);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }

    public async Task JoinGame(Guid gameId, Guid playerId, CancellationToken cancellationToken)
    {
        try
        {
            await _puissanceGameService.JoinAsync(gameId, playerId, cancellationToken);
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
            await Clients.Group(gameId.ToString()).SendAsync("PlayerJoined", playerId);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }

    public async Task PlayMove(Guid gameId, Guid playerId, int column, CancellationToken cancellationToken)
    {
        try
        {
            await _puissanceGameService.PlayMoveAsync(gameId, playerId, column, cancellationToken);
            await Clients.Group(gameId.ToString()).SendAsync("MovePlayed", playerId, column);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }

    public async Task LeaveGame(Guid gameId, Guid playerId, CancellationToken cancellationToken)
    {
        try
        {
            await _puissanceGameService.LeaveAsync(gameId, playerId, cancellationToken);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId.ToString());
            await Clients.Group(gameId.ToString()).SendAsync("PlayerLeft", playerId);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }

    public async Task SetGamePrivacy(Guid gameId, bool isPrivate, string? password, CancellationToken cancellationToken)
    {
        try
        {
            await _puissanceGameService.SetPrivacyAsync(gameId, isPrivate, password, cancellationToken);
            await Clients.Group(gameId.ToString()).SendAsync("PrivacyUpdated", isPrivate, password);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }

    public async Task CheckGamePassword(Guid gameId, string? password, CancellationToken cancellationToken)
    {
        try
        {
            var isValid = await _puissanceGameService.CheckPasswordAsync(gameId, password, cancellationToken);
            await Clients.Caller.SendAsync("PasswordChecked", isValid);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Gérer la déconnexion des joueurs si nécessaire
        await base.OnDisconnectedAsync(exception);
    }
}