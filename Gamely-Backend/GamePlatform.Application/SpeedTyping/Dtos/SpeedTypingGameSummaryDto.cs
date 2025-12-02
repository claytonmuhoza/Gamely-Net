namespace GamePlatform.Application.SpeedTyping;

public record SpeedTypingGameSummaryDto(
    Guid GameId,
    Guid LobbyId,
    int PlayerCount,
    string Status,
    DateTime? StartedAt,
    TimeSpan? Duration
);