namespace GamePlatform.Contracts.Scores;

public sealed record ScoreEntryDto(
    string GameId,
    Guid ClientId,
    string Pseudo,
    long Value,
    DateTimeOffset AchievedAt
);