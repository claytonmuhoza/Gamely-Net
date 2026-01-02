namespace GamePlatform.Contracts.Games.SpeedTyping;

public sealed record SpeedTypingRunnerDto(
    Guid ClientId,
    string Pseudo,
    int Progress,
    long? FinishedAtUnixMs
);

public sealed record SpeedTypingStateDto(
    Guid LobbyId,
    string Phase, // "Running" | "Finished"
    string TextId,
    string Text,
    long StartedAtUnixMs,
    long? EndedAtUnixMs,
    List<SpeedTypingRunnerDto> Runners
);