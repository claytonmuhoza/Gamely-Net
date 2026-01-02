namespace GamePlatform.Contracts.Lobbies;

public sealed record LeaveLobbyRequest(
    Guid ClientId
);