namespace GamePlatform.Application.SpeedTyping;

public record UpdatePlayerProgressDto(
    Guid GameId,
    Guid PlayerId,
    string TypedText
);
