namespace GamePlatform.Application.SpeedTyping;

public record CreateSpeedTypingGameDto(
    Guid LobbyId,
    string TextDifficulty,
    List<Guid> PlayerIds,
    int DurationSeconds = 60
);
