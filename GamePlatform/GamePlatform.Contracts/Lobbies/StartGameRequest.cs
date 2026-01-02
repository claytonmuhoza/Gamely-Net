namespace GamePlatform.Contracts.Lobbies;

public sealed record StartGameRequest(
    Guid ClientId
);