using GamePlatform.Domain;
using GamePlatform.Domain.Scores;

namespace GamePlatform.Application.Scores;

public interface IScoreRepository
{
    Task AddAsync(ScoreEntry entry, CancellationToken ct);
    Task<List<ScoreEntry>> GetTopAsync(GameId gameId, int limit, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}