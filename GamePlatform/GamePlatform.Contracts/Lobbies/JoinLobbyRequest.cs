namespace GamePlatform.Contracts.Lobbies;

public sealed record JoinLobbyRequest(
    Guid ClientId,
    string Pseudo,
    string? Password
);