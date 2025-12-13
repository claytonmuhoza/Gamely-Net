using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Interfaces.Repositories;

public interface IMorpionGameRepository
{
    Task<MorpionGame> AddAsync(MorpionGame game, CancellationToken cancellationToken = default);
    Task<MorpionGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task UpdateAsync(MorpionGame game, CancellationToken cancellationToken = default);
}