using GamePlatforme.domain.Entities.SpeedTyping;

namespace GamePlatform.Application.Interfaces.Repositories;

public interface ISpeedTypingGameRepository
{
    Task<SpeedTypingGame> AddAsync(SpeedTypingGame game, CancellationToken cancellationToken = default);
    Task<SpeedTypingGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task UpdateAsync(SpeedTypingGame game, CancellationToken cancellationToken = default);
}