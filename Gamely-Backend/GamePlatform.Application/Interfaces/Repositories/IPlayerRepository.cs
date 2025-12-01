using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Players;
public interface IPlayerRepository
{
    Task<Player> AddAsync(Player player, CancellationToken cancellationToken = default);
    Task<Player?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}