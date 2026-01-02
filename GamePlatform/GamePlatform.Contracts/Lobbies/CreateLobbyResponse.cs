namespace GamePlatform.Contracts.Lobbies;

public sealed record CreateLobbyResponse(
    Guid LobbyId,
    string JoinLink
);