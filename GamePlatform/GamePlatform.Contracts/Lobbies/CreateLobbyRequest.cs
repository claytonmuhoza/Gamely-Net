namespace GamePlatform.Contracts.Lobbies;

public sealed record CreateLobbyRequest(
    Guid ClientId,
    string Pseudo,
    string GameId,     // "Morpion" | "Puissance4" | "SpeedTyping"
    bool IsPrivate,
    string? Password
);