namespace GamePlatform.Application.Games.SpeedTyping;

public sealed class SpeedTypingSnapshot
{
    public string TextId { get; set; } = default!;
    public string Text { get; set; } = default!;

    public long StartedAtUnixMs { get; set; }
    public long? EndedAtUnixMs { get; set; }

    // anti-spam simple côté serveur
    public long MinUpdateIntervalMs { get; set; } = 100;

    public List<RunnerSnapshot> Runners { get; set; } = new();
}

public sealed class RunnerSnapshot
{
    public Guid ClientId { get; set; }
    public string Pseudo { get; set; } = default!;
    public int Progress { get; set; }
    public long? FinishedAtUnixMs { get; set; }
    public long LastUpdateUnixMs { get; set; }
}