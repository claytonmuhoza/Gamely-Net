using GamePlatform.Application.SpeedTyping;

namespace GamePlatform.Application.Interfaces.Services;

public interface ITypingTextService
{
    Task<TypingTextDto> CreateTextAsync(string content, string difficulty, string language = "fr", CancellationToken cancellationToken = default);
    Task<TypingTextDto> GetRandomTextAsync(string difficulty, string language = "fr", CancellationToken cancellationToken = default);
    Task<List<TypingTextDto>> GetAllTextsAsync(CancellationToken cancellationToken = default);
    Task<List<TypingTextDto>> GetTextsByDifficultyAsync(string difficulty, CancellationToken cancellationToken = default);
}