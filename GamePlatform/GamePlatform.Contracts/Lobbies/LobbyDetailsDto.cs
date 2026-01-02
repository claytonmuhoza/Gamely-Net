namespace GamePlatform.Contracts.Lobbies;

public sealed record LobbyPlayerDto(Guid ClientId, string Pseudo);

public sealed record LobbyDetailsDto(
    Guid LobbyId,
    string GameId,
    string Status,
    bool IsPrivate,
    Guid HostClientId,
    List<LobbyPlayerDto> Players,
    DateTimeOffset CreatedAt
);