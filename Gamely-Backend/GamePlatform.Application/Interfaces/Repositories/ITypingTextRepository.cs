using GamePlatforme.domain.Entities.SpeedTyping;

namespace GamePlatform.Application.Interfaces.Repositories;

public interface ITypingTextRepository
{
    Task<TypingText?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<TypingText>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<List<TypingText>> GetByDifficultyAsync(TextDifficulty difficulty, CancellationToken cancellationToken = default);
    Task<List<TypingText>> GetByLanguageAsync(string language, CancellationToken cancellationToken = default);
    Task<TypingText?> GetRandomByDifficultyAsync(TextDifficulty difficulty, string language = "fr", CancellationToken cancellationToken = default);
    Task AddAsync(TypingText text, CancellationToken cancellationToken = default);
    Task UpdateAsync(TypingText text, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}