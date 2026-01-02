namespace GamePlatform.Application.Games.Logs;

public interface IGameActionLogger
{
    Task LogAsync(
        Guid gameSessionId,
        string actionType,
        string payloadJson,
        Guid? actorClientId,
        CancellationToken ct);
}