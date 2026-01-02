namespace GamePlatform.Contracts.Games;

public sealed record PlayMorpionMoveRequest(
    Guid ClientId,
    int Index
);