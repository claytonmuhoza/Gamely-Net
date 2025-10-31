namespace GamePlatform.Core.Models;


public interface ILobbyService
{
    Task<Lobby> CreateLobbyAsync(string gameType, Guid hostId, string? password);
    Task<Lobby?> GetLobbyAsync(Guid lobbyId);
    Task JoinLobbyAsync(Guid lobbyId, Player player, string? password);
}