using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Application.Interfaces.Services;
using GamePlatforme.domain.Entities.SpeedTyping;

namespace GamePlatform.Application.SpeedTyping;

public class TypingTextService : ITypingTextService
{
    private readonly ITypingTextRepository _textRepository;

    public TypingTextService(ITypingTextRepository textRepository)
    {
        _textRepository = textRepository;
    }

    public async Task<TypingTextDto> CreateTextAsync(string content, string difficulty, string language = "fr", CancellationToken cancellationToken = default)
    {
        if (!Enum.TryParse<TextDifficulty>(difficulty, true, out var difficultyEnum))
            throw new ArgumentException($"Invalid difficulty: {difficulty}");

        var text = new TypingText(content, difficultyEnum, language);
        await _textRepository.AddAsync(text, cancellationToken);

        return MapToDto(text);
    }

    public async Task<TypingTextDto> GetRandomTextAsync(string difficulty, string language = "fr", CancellationToken cancellationToken = default)
    {
        if (!Enum.TryParse<TextDifficulty>(difficulty, true, out var difficultyEnum))
            throw new ArgumentException($"Invalid difficulty: {difficulty}");

        var text = await _textRepository.GetRandomByDifficultyAsync(difficultyEnum, language, cancellationToken);
        if (text == null)
            throw new InvalidOperationException($"No text found for difficulty {difficulty}");

        return MapToDto(text);
    }

    public async Task<List<TypingTextDto>> GetAllTextsAsync(CancellationToken cancellationToken = default)
    {
        var texts = await _textRepository.GetAllAsync(cancellationToken);
        return texts.Select(MapToDto).ToList();
    }

    public async Task<List<TypingTextDto>> GetTextsByDifficultyAsync(string difficulty, CancellationToken cancellationToken = default)
    {
        if (!Enum.TryParse<TextDifficulty>(difficulty, true, out var difficultyEnum))
            throw new ArgumentException($"Invalid difficulty: {difficulty}");

        var texts = await _textRepository.GetByDifficultyAsync(difficultyEnum, cancellationToken);
        return texts.Select(MapToDto).ToList();
    }

    private TypingTextDto MapToDto(TypingText text)
    {
        return new TypingTextDto(
            text.Id,
            text.Content,
            text.Difficulty.ToString(),
            text.WordCount,
            text.Language
        );
    }
}