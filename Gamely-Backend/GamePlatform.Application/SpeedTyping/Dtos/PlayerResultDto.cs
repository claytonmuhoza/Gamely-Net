namespace GamePlatform.Application.SpeedTyping;

public record PlayerResultDto(
    Guid PlayerId,
    string PlayerPseudo,
    int Rank,
    TimeSpan CompletionTime,
    double Accuracy,
    double WPM,
    int ErrorCount,
    int Score
);