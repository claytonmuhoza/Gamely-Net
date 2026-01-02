using GamePlatform.Contracts.Scores;
using GamePlatform.Domain;
using GamePlatform.Domain.Scores;

namespace GamePlatform.Application.Scores;

public sealed class ScoreService
{
    private readonly IScoreRepository _repo;

    public ScoreService(IScoreRepository repo) => _repo = repo;

    public async Task AddScoreAsync(GameId gameId, Guid clientId, string pseudo, long value, CancellationToken ct)
    {
        var entry = new ScoreEntry
        {
            GameId = gameId,
            ClientId = clientId,
            Pseudo = pseudo,
            Value = value,
            AchievedAt = DateTimeOffset.UtcNow
        };

        await _repo.AddAsync(entry, ct);
        await _repo.SaveChangesAsync(ct);
    }

    public async Task<List<ScoreEntryDto>> GetTopAsync(GameId gameId, int limit, CancellationToken ct)
    {
        var list = await _repo.GetTopAsync(gameId, limit, ct);

        return list.Select(s => new ScoreEntryDto(
            GameId: s.GameId.ToString(),
            ClientId: s.ClientId,
            Pseudo: s.Pseudo,
            Value: s.Value,
            AchievedAt: s.AchievedAt
        )).ToList();
    }
}