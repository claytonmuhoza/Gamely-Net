namespace GamePlatform.Application.SpeedTyping;

public class PlayerResultDto
{
    public Guid PlayerId { get; set; }
    public string PlayerPseudo { get; set; } = string.Empty;
    public int Rank { get; set; }
    public TimeSpan CompletionTime { get; set; }
    public double Accuracy { get; set; }
    public double WPM { get; set; }
    public int ErrorCount { get; set; }
    public int Score { get; set; }
}