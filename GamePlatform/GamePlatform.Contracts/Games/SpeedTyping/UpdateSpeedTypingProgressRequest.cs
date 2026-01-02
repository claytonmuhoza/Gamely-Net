namespace GamePlatform.Contracts.Games.SpeedTyping;

public sealed record UpdateSpeedTypingProgressRequest(
    Guid ClientId,
    int Progress
);