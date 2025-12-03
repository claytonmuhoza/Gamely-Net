namespace GamePlatforme.domain.Entities.SpeedTyping;

public class PlayerResult
{   public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid PlayerId { get; private set; }
    public int Rank { get; private set; }
    public TimeSpan CompletionTime { get; private set; }
    public double Accuracy { get; private set; }
    public double WPM { get; private set; }
    public int ErrorCount { get; private set; }
    public int Score { get; private set; }

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