using GamePlatform.Domain;

namespace GamePlatform.Application.Lobbies;

public interface ILobbyRepository
{
    Task AddAsync(Lobby lobby, CancellationToken ct);
    Task<List<Lobby>> ListWaitingAsync(CancellationToken ct);

    Task<Lobby?> GetByIdAsync(Guid lobbyId, CancellationToken ct);

    Task SaveChangesAsync(CancellationToken ct);
    Task RemoveAsync(Lobby lobby, CancellationToken ct);
    
    Task<List<Lobby>> GetAllAsync(CancellationToken ct);
}