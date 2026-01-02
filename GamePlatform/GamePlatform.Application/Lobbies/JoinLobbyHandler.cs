using GamePlatform.Application.Realtime;
using GamePlatform.Contracts.Lobbies;
using GamePlatform.Domain;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Application.Lobbies;

public sealed class JoinLobbyHandler
{
    private readonly ILobbyRepository _repo;
    private readonly ILobbyNotifier _notifier;

    public JoinLobbyHandler(ILobbyRepository repo, ILobbyNotifier notifier)
    {
        _repo = repo;
        _notifier = notifier;
    }

    public async Task<Lobby> Handle(Guid lobbyId, JoinLobbyRequest req, CancellationToken ct)
    {
        if (req.ClientId == Guid.Empty) throw new ArgumentException("ClientId is required");
        if (string.IsNullOrWhiteSpace(req.Pseudo)) throw new ArgumentException("Pseudo is required");

        var lobby = await _repo.GetByIdAsync(lobbyId, ct)
                   ?? throw new KeyNotFoundException("Lobby not found");

        if (lobby.Status != LobbyStatus.Waiting)
            throw new InvalidOperationException("Lobby is not joinable");

        if (lobby.IsPrivate)
        {
            if (string.IsNullOrWhiteSpace(req.Password))
                throw new UnauthorizedAccessException("Password required");

            if (string.IsNullOrWhiteSpace(lobby.PasswordHash) ||
                !PasswordHashing.Verify(req.Password, lobby.PasswordHash))
                throw new UnauthorizedAccessException("Invalid password");
        }

        // idempotent
        if (lobby.Players.Any(p => p.ClientId == req.ClientId))
            return lobby;

        var maxPlayers = lobby.GameId == GameId.SpeedTyping ? 8 : 2;
        if (lobby.Players.Count >= maxPlayers)
            throw new InvalidOperationException("Lobby is full");

        lobby.Players.Add(new LobbyPlayer
        {
            ClientId = req.ClientId,
            Pseudo = req.Pseudo.Trim(),
            JoinedAt = DateTimeOffset.UtcNow
        });

        try
        {
            await _repo.SaveChangesAsync(ct);
        }
        catch (DbUpdateConcurrencyException)
        {
            // InMemory + requêtes concurrentes => on re-check et on accepte si déjà ajouté.
            var fresh = await _repo.GetByIdAsync(lobbyId, ct)
                        ?? throw new KeyNotFoundException("Lobby not found");

            if (fresh.Players.Any(p => p.ClientId == req.ClientId))
                return fresh;

            throw; // sinon vraie erreur
        }

        await _notifier.NotifyLobbyUpdated(lobby.Id, ct);
        await _notifier.NotifyLobbyListUpdated(ct);

        return lobby;
    }
}
