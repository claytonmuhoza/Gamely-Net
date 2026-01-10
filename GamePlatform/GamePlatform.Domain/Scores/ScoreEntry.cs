using GamePlatform.Domain;

namespace GamePlatform.Domain.Scores;

public sealed class ScoreEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public GameId GameId { get; set; }

    public Guid? LobbyId { get; set; }
    public Guid? GameSessionId { get; set; }

    public Guid ClientId { get; set; }
    public string Pseudo { get; set; } = default!;

    public long Value { get; set; }

    public DateTimeOffset AchievedAt { get; set; } = DateTimeOffset.UtcNow;
}