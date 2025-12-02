using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Interfaces.Repositories;
public interface IPlayerRepository
{
    Task<Player> AddAsync(Player player, CancellationToken cancellationToken = default);
    Task<Player?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Player>> GetByIdsAsync(List<Guid> ids, CancellationToken cancellationToken = default);

}