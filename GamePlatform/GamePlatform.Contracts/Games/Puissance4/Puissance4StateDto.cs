namespace GamePlatform.Contracts.Games.Puissance4;

public sealed record Puissance4PlayerDto(Guid ClientId, string Pseudo, string Color);

public sealed record Puissance4StateDto(
    Guid LobbyId,
    string Phase, // "Running" | "Finished"
    List<Puissance4PlayerDto> Players,
    Guid CurrentPlayerId,
    List<List<string>> Grid, // 7 colonnes de 6 cellules: "", "R", "Y"
    Guid? WinnerClientId,
    bool IsDraw
);