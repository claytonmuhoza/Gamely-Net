namespace GamePlatform.Contracts.Lobbies;

public sealed record LobbyListItemDto(
    Guid LobbyId,
    string GameId,
    string Status,
    bool IsPrivate,
    int PlayersCount,
    DateTimeOffset CreatedAt,
    string HostPseudo
);
