using GamePlatform.Application.Scores;
using GamePlatform.Domain;
using GamePlatform.Domain.Scores;
using GamePlatform.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Scores;

public sealed class ScoreRepository : IScoreRepository
{
    private readonly AppDbContext _db;

    public ScoreRepository(AppDbContext db) => _db = db;

    public Task AddAsync(ScoreEntry entry, CancellationToken ct)
        => _db.Scores.AddAsync(entry, ct).AsTask();

    public async Task<List<ScoreEntry>> GetTopAsync(
        GameId gameId,
        int limit,
        ScoreOrdering ordering,
        CancellationToken ct)
    {
        // Regroupement par ClientId avec somme des scores
        var aggregatedScores = await _db.Scores
            .AsNoTracking()
            .Where(s => s.GameId == gameId)
            .GroupBy(s => s.ClientId)
            .Select(g => new
            {
                ClientId = g.Key,
                TotalValue = g.Sum(s => s.Value),
                Pseudo = g.OrderByDescending(s => s.AchievedAt).First().Pseudo,
                LatestAchievedAt = g.Max(s => s.AchievedAt),
                // Garder les autres propriétés du score le plus récent
                GameId = gameId,
                FirstScoreId = g.OrderByDescending(s => s.AchievedAt).First().Id,
                LobbyId = g.OrderByDescending(s => s.AchievedAt).First().LobbyId,
                GameSessionId = g.OrderByDescending(s => s.AchievedAt).First().GameSessionId
            })
            .ToListAsync(ct);

        // Tri selon l'ordering
        var sorted = ordering == ScoreOrdering.LowerIsBetter
            ? aggregatedScores.OrderBy(s => s.TotalValue).ThenBy(s => s.LatestAchievedAt)
            : aggregatedScores.OrderByDescending(s => s.TotalValue).ThenBy(s => s.LatestAchievedAt);

        // Conversion en ScoreEntry et limitation
        return sorted
            .Take(limit)
            .Select(s => new ScoreEntry
            {
                Id = s.FirstScoreId,
                GameId = s.GameId,
                LobbyId = s.LobbyId,
                GameSessionId = s.GameSessionId,
                ClientId = s.ClientId,
                Pseudo = s.Pseudo,
                Value = s.TotalValue, // ← La somme !
                AchievedAt = s.LatestAchievedAt
            })
            .ToList();
    }

    public Task SaveChangesAsync(CancellationToken ct)
        => _db.SaveChangesAsync(ct);
}