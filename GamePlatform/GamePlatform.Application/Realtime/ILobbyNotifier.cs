namespace GamePlatform.Application.Realtime;

public interface ILobbyNotifier
{
    Task NotifyLobbyListUpdated(CancellationToken ct);
    Task NotifyLobbyUpdated(Guid lobbyId, CancellationToken ct);
}