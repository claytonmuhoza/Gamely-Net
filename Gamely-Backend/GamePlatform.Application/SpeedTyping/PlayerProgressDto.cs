namespace GamePlatform.Application.SpeedTyping;

public class PlayerProgressDto
{
    public Guid PlayerId { get; set; }
    public string PlayerPseudo { get; set; } = string.Empty;
    public string CurrentTypedText { get; set; } = string.Empty;
    public int CorrectCharacters { get; set; }
    public int TotalCharacters { get; set; }
    public int ErrorCount { get; set; }
    public double Accuracy { get; set; }
    public double CurrentWPM { get; set; }
    public bool HasFinished { get; set; }
    public DateTime? FinishedAt { get; set; }
    public TimeSpan? CompletionTime { get; set; }
}