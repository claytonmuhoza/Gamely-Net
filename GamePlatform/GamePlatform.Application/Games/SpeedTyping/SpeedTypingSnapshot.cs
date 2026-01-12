namespace GamePlatform.Application.Games.SpeedTyping;

public sealed class SpeedTypingSnapshot
{
    public string TextId { get; set; } = default!;
    public string Text { get; set; } = default!;

    public long StartedAtUnixMs { get; set; }
    public long? EndedAtUnixMs { get; set; }

    // Anti-spam simple côté serveur (en millisecondes)
    public long MinUpdateIntervalMs { get; set; } = 100;

    public List<RunnerSnapshot> Runners { get; set; } = new();
}

public sealed class RunnerSnapshot
{
    public Guid ClientId { get; set; }
    public string Pseudo { get; set; } = default!;
    
    // Texte tapé par le joueur
    public string TypedText { get; set; } = "";
    
    // Statistiques
    public int CorrectChars { get; set; }
    public int ErrorCount { get; set; }
    public double WPM { get; set; }
    public double Accuracy { get; set; }
    
    public long? FinishedAtUnixMs { get; set; }
    public long LastUpdateUnixMs { get; set; }
}