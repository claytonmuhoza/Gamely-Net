namespace GamePlatform.Domain.Games.SpeedTyping;

public sealed class SpeedTypingRace
{
    public Guid LobbyId { get; }
    public string TextId { get; }
    public string Text { get; }

    public DateTimeOffset StartedAt { get; }
    public DateTimeOffset? EndedAt { get; private set; }

    private readonly Dictionary<Guid, Runner> _runners;
    public IReadOnlyCollection<Runner> Runners => _runners.Values;

    public bool IsFinished => EndedAt is not null;

    public SpeedTypingRace(
        Guid lobbyId,
        string textId,
        string text,
        DateTimeOffset startedAt,
        Dictionary<Guid, Runner> runners,
        DateTimeOffset? endedAt = null)
    {
        LobbyId = lobbyId;
        TextId = textId;
        Text = text;
        StartedAt = startedAt;
        _runners = runners;
        EndedAt = endedAt;
    }

    public void UpdateProgress(Guid clientId, int progress, DateTimeOffset at)
    {
        if (IsFinished) throw new InvalidOperationException("Race finished");
        if (!_runners.TryGetValue(clientId, out var runner))
            throw new InvalidOperationException("Player not in race");

        if (progress < 0 || progress > 100) throw new ArgumentException("Progress must be 0..100");

        // progression monotone
        if (progress < runner.Progress) throw new InvalidOperationException("Progress cannot go backwards");

        runner.Progress = progress;
        runner.LastUpdateAt = at;

        if (progress == 100 && runner.FinishedAt is null)
        {
            runner.FinishedAt = at;

            // Fin “TP” : on termine quand tout le monde a fini (ou vous pouvez terminer au 1er)
            if (_runners.Values.All(r => r.FinishedAt is not null))
                EndedAt = at;
        }
    }

    public sealed class Runner
    {
        public Guid ClientId { get; }
        public string Pseudo { get; }
        public int Progress { get; set; }
        public DateTimeOffset? FinishedAt { get; set; }
        public DateTimeOffset LastUpdateAt { get; set; }

        public Runner(Guid clientId, string pseudo, DateTimeOffset startedAt)
        {
            ClientId = clientId;
            Pseudo = pseudo;
            Progress = 0;
            FinishedAt = null;
            LastUpdateAt = startedAt;
        }
    }
}
