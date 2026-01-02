using GamePlatform.Domain;

namespace GamePlatform.Application.Games.Logs;

public sealed class GameActionLogger : IGameActionLogger
{
    private readonly IGameActionLogRepository _repo;

    public GameActionLogger(IGameActionLogRepository repo) => _repo = repo;

    public async Task LogAsync(Guid gameSessionId, string actionType, string payloadJson, Guid? actorClientId, CancellationToken ct)
    {
        await _repo.AddAsync(new GameActionLog
        {
            GameSessionId = gameSessionId,
            ActionType = actionType,
            PayloadJson = payloadJson,
            ActorClientId = actorClientId,
            At = DateTimeOffset.UtcNow
        }, ct);

        await _repo.SaveChangesAsync(ct);
    }
}