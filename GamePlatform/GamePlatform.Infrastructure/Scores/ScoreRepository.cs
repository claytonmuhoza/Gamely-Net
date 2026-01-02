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

    public Task<List<ScoreEntry>> GetTopAsync(GameId gameId, int limit, CancellationToken ct)
        => _db.Scores
            .Where(s => s.GameId == gameId)
            .OrderBy(s => s.Value)              // Lower is better (time)
            .ThenByDescending(s => s.AchievedAt)
            .Take(limit)
            .ToListAsync(ct);

    public Task SaveChangesAsync(CancellationToken ct)
        => _db.SaveChangesAsync(ct);
}