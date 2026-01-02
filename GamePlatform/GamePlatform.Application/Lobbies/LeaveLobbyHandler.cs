using GamePlatform.Application.Realtime;
using GamePlatform.Contracts.Lobbies;
using GamePlatform.Domain;

namespace GamePlatform.Application.Lobbies;

public sealed class LeaveLobbyHandler
{
    private readonly ILobbyRepository _repo;
    private readonly ILobbyNotifier _notifier;
    public LeaveLobbyHandler(ILobbyRepository repo, ILobbyNotifier notifier)
    {
        _repo = repo;
        _notifier = notifier;
    }

    public async Task<Lobby?> Handle(Guid lobbyId, LeaveLobbyRequest req, CancellationToken ct)
    {
        if (req.ClientId == Guid.Empty) throw new ArgumentException("ClientId is required");

        var lobby = await _repo.GetByIdAsync(lobbyId, ct);
        if (lobby is null) return null;

        var player = lobby.Players.FirstOrDefault(p => p.ClientId == req.ClientId);
        if (player is null) return lobby; // idempotent

        lobby.Players.Remove(player);

        // If empty: delete lobby
        if (lobby.Players.Count == 0)
        {
            await _repo.RemoveAsync(lobby, ct);
            await _repo.SaveChangesAsync(ct);
            await _notifier.NotifyLobbyUpdated(lobby.Id, ct);
            await _notifier.NotifyLobbyListUpdated(ct);
            return null;
        }

        // If host left: transfer host
        if (lobby.HostClientId == req.ClientId)
        {
            lobby.HostClientId = lobby.Players[0].ClientId;
        }

        await _repo.SaveChangesAsync(ct);
        await _notifier.NotifyLobbyUpdated(lobby.Id, ct);
        await _notifier.NotifyLobbyListUpdated(ct);
        return lobby;
    }
}