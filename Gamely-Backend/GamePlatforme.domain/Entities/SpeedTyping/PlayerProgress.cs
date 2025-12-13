namespace GamePlatforme.domain.Entities.SpeedTyping;

public class PlayerProgress
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PlayerId { get; set; }
    public string CurrentTypedText { get; set; }
    public int CorrectCharacters { get; set; }
    public int TotalCharacters { get; set; }
    public int ErrorCount { get; set; }
    public bool HasFinished { get; set; }
    public DateTime? FinishedAt { get; set; }
    public TimeSpan? CompletionTime { get; set; }

    // ⚠️ AJOUT : Foreign key pour EF Core
    public Guid? SpeedTypingGameId { get; set; }

    protected PlayerProgress() 
    { 
        CurrentTypedText = string.Empty;
    }

    public PlayerProgress(Guid playerId)
    {
        if (playerId == Guid.Empty)
            throw new ArgumentException("PlayerId is required", nameof(playerId));

        PlayerId = playerId;
        CurrentTypedText = string.Empty;
        CorrectCharacters = 0;
        TotalCharacters = 0;
        ErrorCount = 0;
        HasFinished = false;
    }

    public void UpdateProgress(string typedText, string targetText, DateTime startTime)
    {
        if (HasFinished)
            throw new InvalidOperationException("Player has already finished");

        CurrentTypedText = typedText;
        TotalCharacters = typedText.Length;

        // Calcul des caractères corrects
        CorrectCharacters = 0;
        ErrorCount = 0;

        for (int i = 0; i < typedText.Length && i < targetText.Length; i++)
        {
            if (typedText[i] == targetText[i])
                CorrectCharacters++;
            else
                ErrorCount++;
        }

        // Vérifier si le joueur a terminé
        if (typedText == targetText)
        {
            HasFinished = true;
            FinishedAt = DateTime.UtcNow;
            CompletionTime = FinishedAt.Value - startTime;
        }
    }

    public double CalculateAccuracy()
    {
        if (TotalCharacters == 0) return 0;
        return (double)CorrectCharacters / TotalCharacters * 100;
    }

    public double CalculateWPM(TimeSpan elapsed)
    {
        if (elapsed.TotalMinutes == 0) return 0;
        int wordsTyped = CorrectCharacters / 5; // Convention: 5 caractères = 1 mot
        return wordsTyped / elapsed.TotalMinutes;
    }
}