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

    /// <summary>
    /// Met à jour le texte tapé par un joueur
    /// </summary>
    public void UpdateTypedText(Guid clientId, string typedText, DateTimeOffset at)
    {
        if (IsFinished) throw new InvalidOperationException("Race finished");
        if (!_runners.TryGetValue(clientId, out var runner))
            throw new InvalidOperationException("Player not in race");

        if (typedText.Length > Text.Length)
            throw new ArgumentException("Typed text is longer than target text");

        runner.TypedText = typedText;
        runner.LastUpdateAt = at;

        // Calculer les erreurs
        runner.ErrorCount = CalculateErrors(typedText, Text);
        
        // Calculer le progrès (nombre de caractères corrects)
        runner.CorrectChars = CalculateCorrectChars(typedText, Text);

        // Si le joueur a fini de taper tout le texte correctement
        if (typedText.Length == Text.Length && runner.FinishedAt is null)
        {
            runner.FinishedAt = at;
            
            // Calculer les statistiques finales
            var duration = (runner.FinishedAt.Value - StartedAt).TotalMinutes;
            runner.WPM = CalculateWPM(Text.Length, duration);
            runner.Accuracy = CalculateAccuracy(Text.Length, runner.ErrorCount);

            // La course se termine quand le premier joueur finit
            if (EndedAt is null)
            {
                EndedAt = at;
            }
        }
    }

    private static int CalculateErrors(string typed, string target)
    {
        int errors = 0;
        int minLength = Math.Min(typed.Length, target.Length);
        
        for (int i = 0; i < minLength; i++)
        {
            if (typed[i] != target[i])
                errors++;
        }
        
        return errors;
    }

    private static int CalculateCorrectChars(string typed, string target)
    {
        int correct = 0;
        int minLength = Math.Min(typed.Length, target.Length);
        
        for (int i = 0; i < minLength; i++)
        {
            if (typed[i] == target[i])
                correct++;
        }
        
        return correct;
    }

    private static double CalculateWPM(int charCount, double minutes)
    {
        if (minutes <= 0) return 0;
        // Formule standard : (caractères / 5) / minutes
        // On divise par 5 car un mot moyen fait ~5 caractères
        return Math.Round((charCount / 5.0) / minutes, 2);
    }

    private static double CalculateAccuracy(int totalChars, int errors)
    {
        if (totalChars == 0) return 100;
        return Math.Round(((totalChars - errors) / (double)totalChars) * 100, 2);
    }

    public sealed class Runner
    {
        public Guid ClientId { get; }
        public string Pseudo { get; }
        
        // Texte actuellement tapé par le joueur
        public string TypedText { get; set; } = "";
        
        // Statistiques
        public int CorrectChars { get; set; }
        public int ErrorCount { get; set; }
        public double WPM { get; set; }
        public double Accuracy { get; set; }
        
        public DateTimeOffset? FinishedAt { get; set; }
        public DateTimeOffset LastUpdateAt { get; set; }

        public Runner(Guid clientId, string pseudo, DateTimeOffset startedAt)
        {
            ClientId = clientId;
            Pseudo = pseudo;
            TypedText = "";
            CorrectChars = 0;
            ErrorCount = 0;
            WPM = 0;
            Accuracy = 100;
            FinishedAt = null;
            LastUpdateAt = startedAt;
        }
    }
}