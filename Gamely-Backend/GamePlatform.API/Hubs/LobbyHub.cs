using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Players;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.API.Hubs;

public class LobbyHub: Hub
{
    private readonly ILobbyService _lobbyService;
    private readonly IPlayerService _playerService;

    public LobbyHub(ILobbyService lobbyService, IPlayerService playerService)
    {
        _lobbyService = lobbyService;
        _playerService = playerService;
    }
    //appelé par le client pour rejoindre un lobby
    public async Task JoinLobby(Guid lobbyId, Guid playerId){
        var command = new JoinLobbyCommand
        {
            LobbyId = lobbyId,
            PlayerId = playerId,
        };

        var lobbyDto = await _lobbyService.JoinLobbyAsync(command);

        // Ajout de cette connexion au "groupe" du lobby
        var groupName = lobbyDto.Id.ToString();
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        // On peut récupérer le joueur pour info
        var player = await _playerService.GetByIdAsync(playerId);

        // Diffuser à tous les clients du lobby
        await Clients.Group(groupName).SendAsync("LobbyUpdated", new
        {
            lobbyId = lobbyDto.Id,
            code = lobbyDto.Code,
            gameType = lobbyDto.GameType,
            isPrivate = lobbyDto.IsPrivate,
            hasStarted = lobbyDto.HasStarted,
            hostPlayerId = lobbyDto.HostPlayerId,
            playerIds = lobbyDto.PlayerIds,
            lastJoinedPlayerId = player?.Id,
            lastJoinedPlayerPseudo = player?.Pseudo
        });
    }
    public async Task LeaveLobby(Guid lobbyId)
    {
        var groupName = lobbyId.ToString();
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}