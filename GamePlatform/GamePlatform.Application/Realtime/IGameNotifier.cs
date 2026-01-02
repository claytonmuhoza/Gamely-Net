namespace GamePlatform.Application.Realtime;

public interface IGameNotifier
{
    Task NotifyGameStateUpdated(Guid lobbyId, object gameStateDto, CancellationToken ct);
    Task NotifyCommandRejected(Guid lobbyId, string reason, CancellationToken ct);
}