using GamePlatform.Domain;

namespace GamePlatform.Application.Games.Logs;

public interface IGameActionLogRepository
{
    Task AddAsync(GameActionLog log, CancellationToken ct);
    Task<List<GameActionLog>> ListBySessionIdAsync(Guid sessionId, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}