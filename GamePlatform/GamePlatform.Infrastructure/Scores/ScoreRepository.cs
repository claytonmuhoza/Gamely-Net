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
        var q = _db.Scores
            .AsNoTracking()
            .Where(s => s.GameId == gameId);

        q = ordering == ScoreOrdering.LowerIsBetter
            ? q.OrderBy(s => s.Value).ThenBy(s => s.AchievedAt)
            : q.OrderByDescending(s => s.Value).ThenBy(s => s.AchievedAt);

        return await q.Take(limit).ToListAsync(ct);
    }

    public Task SaveChangesAsync(CancellationToken ct)
        => _db.SaveChangesAsync(ct);
}