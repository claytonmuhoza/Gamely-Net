using GamePlatform.Application.Realtime;
using GamePlatform.Contracts.Lobbies;
using GamePlatform.Domain;

namespace GamePlatform.Application.Lobbies;

public sealed class CreateLobbyHandler
{
    private readonly ILobbyRepository _repo;
    private readonly ILobbyNotifier _notifier;

    public CreateLobbyHandler(ILobbyRepository repo, ILobbyNotifier notifier)
    {
        _repo = repo;
        _notifier = notifier;
    }

    public async Task<Lobby> Handle(CreateLobbyRequest req, CancellationToken ct)
    {
        if (req.ClientId == Guid.Empty) throw new ArgumentException("ClientId is required");
        if (string.IsNullOrWhiteSpace(req.Pseudo)) throw new ArgumentException("Pseudo is required");
        if (string.IsNullOrWhiteSpace(req.GameId)) throw new ArgumentException("GameId is required");

        if (!Enum.TryParse<GameId>(req.GameId, ignoreCase: true, out var gameId))
            throw new ArgumentException("Unknown GameId");

        if (req.IsPrivate && string.IsNullOrWhiteSpace(req.Password))
            throw new ArgumentException("Password is required for private lobby");

        var passwordHash = req.IsPrivate ? PasswordHashing.Hash(req.Password!) : null;

        var lobby = new Lobby
        {
            GameId = gameId,
            Status = LobbyStatus.Waiting,
            IsPrivate = req.IsPrivate,
            PasswordHash = passwordHash,
            HostClientId = req.ClientId,
            CreatedAt = DateTimeOffset.UtcNow,
            Players =
            {
                new LobbyPlayer
                {
                    ClientId = req.ClientId,
                    Pseudo = req.Pseudo,
                    JoinedAt = DateTimeOffset.UtcNow
                }
            }
        };
        await _repo.AddAsync(lobby, ct);
        await _repo.SaveChangesAsync(ct);
        await _notifier.NotifyLobbyListUpdated(ct);
        await _notifier.NotifyLobbyUpdated(lobby.Id, ct);
        return lobby;
    }
}