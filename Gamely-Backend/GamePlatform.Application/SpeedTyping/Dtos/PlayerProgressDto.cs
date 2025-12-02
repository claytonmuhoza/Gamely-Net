namespace GamePlatform.Application.SpeedTyping;

public record PlayerProgressDto(
    Guid PlayerId,
    string PlayerPseudo,
    string CurrentTypedText,
    int CorrectCharacters,
    int TotalCharacters,
    int ErrorCount,
    double Accuracy,
    double CurrentWPM,
    bool HasFinished,
    DateTime? FinishedAt,
    TimeSpan? CompletionTime
);