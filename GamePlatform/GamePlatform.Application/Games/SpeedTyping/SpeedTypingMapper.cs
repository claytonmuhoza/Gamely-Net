using GamePlatform.Contracts.Games.SpeedTyping;
using GamePlatform.Domain.Games.SpeedTyping;

namespace GamePlatform.Application.Games.SpeedTyping;

public static class SpeedTypingMapper
{
    public static SpeedTypingRace ToDomain(Guid lobbyId, SpeedTypingSnapshot s)
    {
        var startedAt = DateTimeOffset.FromUnixTimeMilliseconds(s.StartedAtUnixMs);
        DateTimeOffset? endedAt = s.EndedAtUnixMs is null ? null : DateTimeOffset.FromUnixTimeMilliseconds(s.EndedAtUnixMs.Value);

        var runners = new Dictionary<Guid, SpeedTypingRace.Runner>();
        foreach (var r in s.Runners)
        {
            var runner = new SpeedTypingRace.Runner(r.ClientId, r.Pseudo, startedAt)
            {
                Progress = r.Progress,
                FinishedAt = r.FinishedAtUnixMs is null ? null : DateTimeOffset.FromUnixTimeMilliseconds(r.FinishedAtUnixMs.Value),
                LastUpdateAt = DateTimeOffset.FromUnixTimeMilliseconds(r.LastUpdateUnixMs)
            };
            runners[r.ClientId] = runner;
        }

        return new SpeedTypingRace(lobbyId, s.TextId, s.Text, startedAt, runners, endedAt);
    }

    public static SpeedTypingSnapshot ToSnapshot(SpeedTypingRace race, long minUpdateIntervalMs, Dictionary<Guid, long> lastUpdateMs)
    {
        var s = new SpeedTypingSnapshot
        {
            TextId = race.TextId,
            Text = race.Text,
            StartedAtUnixMs = race.StartedAt.ToUnixTimeMilliseconds(),
            EndedAtUnixMs = race.IsFinished ? race.Runners.Max(r => r.FinishedAt?.ToUnixTimeMilliseconds() ?? 0) : null,
            MinUpdateIntervalMs = minUpdateIntervalMs,
            Runners = race.Runners.Select(r => new RunnerSnapshot
            {
                ClientId = r.ClientId,
                Pseudo = r.Pseudo,
                Progress = r.Progress,
                FinishedAtUnixMs = r.FinishedAt?.ToUnixTimeMilliseconds(),
                LastUpdateUnixMs = r.LastUpdateAt.ToUnixTimeMilliseconds()
            }).ToList()
        };
        return s;
    }

    public static SpeedTypingStateDto ToDto(Guid lobbyId, SpeedTypingSnapshot s)
        => new(
            LobbyId: lobbyId,
            Phase: s.EndedAtUnixMs is null ? "Running" : "Finished",
            TextId: s.TextId,
            Text: s.Text,
            StartedAtUnixMs: s.StartedAtUnixMs,
            EndedAtUnixMs: s.EndedAtUnixMs,
            Runners: s.Runners
                .OrderByDescending(r => r.Progress)
                .ThenBy(r => r.FinishedAtUnixMs ?? long.MaxValue)
                .Select(r => new SpeedTypingRunnerDto(r.ClientId, r.Pseudo, r.Progress, r.FinishedAtUnixMs))
                .ToList()
        );
}
