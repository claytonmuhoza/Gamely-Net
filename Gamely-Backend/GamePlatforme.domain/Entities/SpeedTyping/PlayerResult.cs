namespace GamePlatforme.domain.Entities.SpeedTyping;

public class PlayerResult
{   
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PlayerId { get; set; }
    public int Rank { get; set; }
    public TimeSpan CompletionTime { get; set; }
    public double Accuracy { get; set; }
    public double WPM { get; set; }
    public int ErrorCount { get; set; }
    public int Score { get; set; }

    // ⚠️ AJOUT : Foreign key pour EF Core
    public Guid? SpeedTypingGameId { get; set; }

    protected PlayerResult() { }

    public PlayerResult(Guid playerId, int rank, TimeSpan completionTime, double accuracy, double wpm, int errorCount)
    {
        if (playerId == Guid.Empty)
            throw new ArgumentException("PlayerId is required", nameof(playerId));

        PlayerId = playerId;
        Rank = rank;
        CompletionTime = completionTime;
        Accuracy = accuracy;
        WPM = wpm;
        ErrorCount = errorCount;
        Score = CalculateScore(completionTime, accuracy, wpm);
    }

    private static int CalculateScore(TimeSpan time, double accuracy, double wpm)
    {
        // Formule de score: WPM * Précision - pénalité temps
        double baseScore = wpm * (accuracy / 100);
        double timePenalty = time.TotalSeconds / 10;
        return Math.Max(0, (int)(baseScore * 100 - timePenalty));
    }
}