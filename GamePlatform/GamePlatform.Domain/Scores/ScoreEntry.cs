namespace GamePlatform.Domain.Scores;

public sealed class ScoreEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public GameId GameId { get; set; }

    public Guid ClientId { get; set; }
    public string Pseudo { get; set; } = default!;

    // "Lower is better" pour le temps (ms)
    public long Value { get; set; }

    public DateTimeOffset AchievedAt { get; set; } = DateTimeOffset.UtcNow;
}