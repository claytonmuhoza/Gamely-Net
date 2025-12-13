using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Puissance;

public interface IPuissanceGameRepository
{
    Task<PuissanceGame> AddAsync(PuissanceGame game, CancellationToken cancellationToken = default);
    Task<PuissanceGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task UpdateAsync(PuissanceGame game, CancellationToken cancellationToken = default);
}