namespace GamePlatforme.domain.Entities.SpeedTyping;

public class SpeedTypingGame
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid LobbyId { get; private set; }
    public TypingText Text { get; private set; }
    public SpeedTypingStatus Status { get; private set; }
    public DateTime? StartedAt { get; private set; }
    public DateTime? FinishedAt { get; private set; }
    public List<PlayerProgress> PlayerProgresses { get; private set; }
    public List<PlayerResult> Results { get; private set; }
    public int DurationSeconds { get; private set; }

    protected SpeedTypingGame() 
    { 
        Text = null!;
        PlayerProgresses = new();
        Results = new();
    }

    public SpeedTypingGame(Guid lobbyId, TypingText text, List<Guid> playerIds, int durationSeconds = 60)
    {
        if (lobbyId == Guid.Empty)
            throw new ArgumentException("LobbyId is required", nameof(lobbyId));
        
        if (text == null)
            throw new ArgumentNullException(nameof(text));

        if (playerIds == null || playerIds.Count == 0)
            throw new ArgumentException("At least one player is required", nameof(playerIds));

        if (durationSeconds <= 0)
            throw new ArgumentException("Duration must be positive", nameof(durationSeconds));

        LobbyId = lobbyId;
        Text = text;
        Status = SpeedTypingStatus.WaitingToStart;
        DurationSeconds = durationSeconds;
        PlayerProgresses = playerIds.Select(id => new PlayerProgress(id)).ToList();
        Results = new();
    }

    public void Start()
    {
        if (Status != SpeedTypingStatus.WaitingToStart)
            throw new InvalidOperationException("Game is not in waiting state");

        Status = SpeedTypingStatus.InProgress;
        StartedAt = DateTime.UtcNow;
    }

    public void UpdatePlayerProgress(Guid playerId, string typedText)
    {
        if (Status != SpeedTypingStatus.InProgress)
            throw new InvalidOperationException("Game is not in progress");

        if (!StartedAt.HasValue)
            throw new InvalidOperationException("Game has not started");

        var progress = PlayerProgresses.FirstOrDefault(p => p.PlayerId == playerId);
        if (progress == null)
            throw new InvalidOperationException("Player not found in game");

        progress.UpdateProgress(typedText, Text.Content, StartedAt.Value);

        // Vérifier si tous les joueurs ont fini ou si le temps est écoulé
        if (ShouldFinish())
        {
            Finish();
        }
    }

    private bool ShouldFinish()
    {
        // Tous les joueurs ont terminé
        if (PlayerProgresses.All(p => p.HasFinished))
            return true;

        // Le temps est écoulé
        if (StartedAt.HasValue)
        {
            var elapsed = DateTime.UtcNow - StartedAt.Value;
            if (elapsed.TotalSeconds >= DurationSeconds)
                return true;
        }

        return false;
    }

    public void Finish()
    {
        if (Status != SpeedTypingStatus.InProgress)
            throw new InvalidOperationException("Game is not in progress");

        Status = SpeedTypingStatus.Finished;
        FinishedAt = DateTime.UtcNow;

        // Calculer les résultats et les classements
        CalculateResults();
    }

    private void CalculateResults()
    {
        if (!StartedAt.HasValue)
            throw new InvalidOperationException("Game has not started");

        var sortedProgresses = PlayerProgresses
            .Where(p => p.HasFinished)
            .OrderBy(p => p.CompletionTime)
            .ThenByDescending(p => p.CalculateAccuracy())
            .ToList();

        // Joueurs qui n'ont pas fini
        var unfinishedProgresses = PlayerProgresses
            .Where(p => !p.HasFinished)
            .OrderByDescending(p => p.CorrectCharacters)
            .ThenByDescending(p => p.CalculateAccuracy())
            .ToList();

        Results = new List<PlayerResult>();
        int rank = 1;

        // Ajouter les joueurs qui ont terminé
        foreach (var progress in sortedProgresses)
        {
            var elapsed = progress.CompletionTime ?? TimeSpan.Zero;
            var result = new PlayerResult(
                progress.PlayerId,
                rank++,
                elapsed,
                progress.CalculateAccuracy(),
                progress.CalculateWPM(elapsed),
                progress.ErrorCount
            );
            Results.Add(result);
        }

        // Ajouter les joueurs qui n'ont pas terminé
        foreach (var progress in unfinishedProgresses)
        {
            var elapsed = DateTime.UtcNow - StartedAt.Value;
            var result = new PlayerResult(
                progress.PlayerId,
                rank++,
                elapsed,
                progress.CalculateAccuracy(),
                progress.CalculateWPM(elapsed),
                progress.ErrorCount
            );
            Results.Add(result);
        }
    }

    public PlayerProgress? GetPlayerProgress(Guid playerId)
    {
        return PlayerProgresses.FirstOrDefault(p => p.PlayerId == playerId);
    }

    public PlayerResult? GetPlayerResult(Guid playerId)
    {
        return Results.FirstOrDefault(r => r.PlayerId == playerId);
    }
}