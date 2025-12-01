using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Morpion;

public interface IMorpionGameRepository
{
    Task<MorpionGame> AddAsync(MorpionGame game, CancellationToken cancellationToken = default);
    Task<MorpionGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task UpdateAsync(MorpionGame game, CancellationToken cancellationToken = default);
}