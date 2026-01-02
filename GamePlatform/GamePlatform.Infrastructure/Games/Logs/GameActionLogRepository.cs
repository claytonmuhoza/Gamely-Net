using GamePlatform.Application.Games.Logs;
using GamePlatform.Domain;
using GamePlatform.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Games.Logs;

public sealed class GameActionLogRepository : IGameActionLogRepository
{
    private readonly AppDbContext _db;
    public GameActionLogRepository(AppDbContext db) => _db = db;

    public Task AddAsync(GameActionLog log, CancellationToken ct)
        => _db.GameActions.AddAsync(log, ct).AsTask();

    public Task<List<GameActionLog>> ListBySessionIdAsync(Guid sessionId, CancellationToken ct)
        => _db.GameActions
            .Where(x => x.GameSessionId == sessionId)
            .OrderBy(x => x.At)
            .ToListAsync(ct);

    public Task SaveChangesAsync(CancellationToken ct)
        => _db.SaveChangesAsync(ct);
}