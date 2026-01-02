namespace GamePlatform.Contracts.Games;

public sealed record DropPuissance4DiscRequest(
    Guid ClientId,
    int Column
);