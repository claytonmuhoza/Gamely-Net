using GamePlatform.Contracts.Games.SpeedTyping;
using GamePlatform.Domain.Games.SpeedTyping;

namespace GamePlatform.Application.Games.SpeedTyping;

public static class SpeedTypingMapper
{
    public static SpeedTypingRace ToDomain(Guid lobbyId, SpeedTypingSnapshot s)
    {
        var startedAt = DateTimeOffset.FromUnixTimeMilliseconds(s.StartedAtUnixMs);
        DateTimeOffset? endedAt = s.EndedAtUnixMs is null 
            ? null 
            : DateTimeOffset.FromUnixTimeMilliseconds(s.EndedAtUnixMs.Value);

        var runners = new Dictionary<Guid, SpeedTypingRace.Runner>();
        foreach (var r in s.Runners)
        {
            var runner = new SpeedTypingRace.Runner(r.ClientId, r.Pseudo, startedAt)
            {
                TypedText = r.TypedText,
                CorrectChars = r.CorrectChars,
                ErrorCount = r.ErrorCount,
                WPM = r.WPM,
                Accuracy = r.Accuracy,
                FinishedAt = r.FinishedAtUnixMs is null 
                    ? null 
                    : DateTimeOffset.FromUnixTimeMilliseconds(r.FinishedAtUnixMs.Value),
                LastUpdateAt = DateTimeOffset.FromUnixTimeMilliseconds(r.LastUpdateUnixMs)
            };
            runners[r.ClientId] = runner;
        }

        return new SpeedTypingRace(lobbyId, s.TextId, s.Text, startedAt, runners, endedAt);
    }

    public static SpeedTypingSnapshot ToSnapshot(SpeedTypingRace race, long minUpdateIntervalMs)
    {
        var s = new SpeedTypingSnapshot
        {
            TextId = race.TextId,
            Text = race.Text,
            StartedAtUnixMs = race.StartedAt.ToUnixTimeMilliseconds(),
            EndedAtUnixMs = race.EndedAt?.ToUnixTimeMilliseconds(),
            MinUpdateIntervalMs = minUpdateIntervalMs,
            Runners = race.Runners.Select(r => new RunnerSnapshot
            {
                ClientId = r.ClientId,
                Pseudo = r.Pseudo,
                TypedText = r.TypedText,
                CorrectChars = r.CorrectChars,
                ErrorCount = r.ErrorCount,
                WPM = r.WPM,
                Accuracy = r.Accuracy,
                FinishedAtUnixMs = r.FinishedAt?.ToUnixTimeMilliseconds(),
                LastUpdateUnixMs = r.LastUpdateAt.ToUnixTimeMilliseconds()
            }).ToList()
        };
        return s;
    }

    public static SpeedTypingStateDto ToDto(Guid lobbyId, SpeedTypingSnapshot s)
    {
        // Trier les joueurs pour le classement
        // 1. Ceux qui ont fini sont classés par temps (plus rapide = meilleur)
        // 2. Ceux qui n'ont pas fini sont classés par progression (plus de caractères corrects = meilleur)
        var sortedRunners = s.Runners
            .OrderByDescending(r => r.FinishedAtUnixMs.HasValue) // Finis d'abord
            .ThenBy(r => r.FinishedAtUnixMs ?? long.MaxValue)    // Parmi les finis, temps croissant
            .ThenByDescending(r => r.CorrectChars)               // Parmi les non-finis, progression décroissante
            .ToList();

        // Attribuer les rangs
        var runnersWithRank = sortedRunners.Select((r, index) => new SpeedTypingRunnerDto(
            ClientId: r.ClientId,
            Pseudo: r.Pseudo,
            TypedText: r.TypedText,
            CorrectChars: r.CorrectChars,
            ErrorCount: r.ErrorCount,
            WPM: r.WPM,
            Accuracy: r.Accuracy,
            FinishedAtUnixMs: r.FinishedAtUnixMs,
            Rank: index + 1 // Rang de 1 à N
        )).ToList();

        return new SpeedTypingStateDto(
            LobbyId: lobbyId,
            Phase: s.EndedAtUnixMs is null ? "Running" : "Finished",
            TextId: s.TextId,
            Text: s.Text,
            StartedAtUnixMs: s.StartedAtUnixMs,
            EndedAtUnixMs: s.EndedAtUnixMs,
            Runners: runnersWithRank
        );
    }
}