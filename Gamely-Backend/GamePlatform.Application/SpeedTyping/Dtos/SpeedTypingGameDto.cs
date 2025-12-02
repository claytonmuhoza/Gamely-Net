namespace GamePlatform.Application.SpeedTyping;

public record SpeedTypingGameDto(
    Guid Id,
    Guid LobbyId,
    TypingTextDto Text,
    string Status,
    DateTime? StartedAt,
    DateTime? FinishedAt,
    int DurationSeconds,
    List<PlayerProgressDto> PlayerProgresses,
    List<PlayerResultDto> Results
);