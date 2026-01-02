namespace GamePlatform.Contracts.Games.Morpion;

public sealed record MorpionPlayerDto(Guid ClientId, string Pseudo, string Symbol);

public sealed record MorpionStateDto(
    Guid LobbyId,
    string Phase, // "Running" | "Finished"
    List<MorpionPlayerDto> Players,
    Guid CurrentPlayerId,
    List<string> Board, // "", "X", "O"
    Guid? WinnerClientId,
    bool IsDraw
);