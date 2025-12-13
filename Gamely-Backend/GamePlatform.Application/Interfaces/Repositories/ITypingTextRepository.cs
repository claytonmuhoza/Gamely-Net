using GamePlatforme.domain.Entities.SpeedTyping;

namespace GamePlatform.Application.Interfaces.Repositories;

public interface ITypingTextRepository
{
    Task<TypingText?> GetRandomByDifficultyAsync(TextDifficulty difficulty, string language = "fr", CancellationToken cancellationToken = default);
}