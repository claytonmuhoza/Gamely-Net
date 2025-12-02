namespace GamePlatform.Application.SpeedTyping;

public record TypingTextDto(
    Guid Id,
    string Content,
    string Difficulty,
    int WordCount,
    string Language
);
