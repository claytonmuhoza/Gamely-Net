namespace GamePlatform.Contracts.Games.SpeedTyping;

public sealed record SpeedTypingRunnerDto(
    Guid ClientId,
    string Pseudo,
    string TypedText,
    int CorrectChars,
    int ErrorCount,
    double WPM,
    double Accuracy,
    long? FinishedAtUnixMs,
    int? Rank // Position dans le classement (1 = premier, etc.)
);

public sealed record SpeedTypingStateDto(
    Guid LobbyId,
    string Phase, // "Running" | "Finished"
    string TextId,
    string Text,
    long StartedAtUnixMs,
    long? EndedAtUnixMs,
    List<SpeedTypingRunnerDto> Runners // Déjà triés par classement
);