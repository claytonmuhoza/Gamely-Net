using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Interfaces.Repositories;

public interface ILobbyRepository
{
    Task<Lobby> AddAsync(Lobby lobby, CancellationToken cancellationToken = default);
    Task<Lobby?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Lobby?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<IEnumerable<Lobby>> GetOpenLobbiesAsync(CancellationToken cancellationToken = default);
    Task UpdateAsync(Lobby lobby, CancellationToken cancellationToken = default);
}
