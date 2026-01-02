using GamePlatform.Contracts.Lobbies;

namespace GamePlatform.Application.Lobbies;

public sealed class GetLobbyDetailsHandler
{
    private readonly ILobbyRepository _repo;

    public GetLobbyDetailsHandler(ILobbyRepository repo) => _repo = repo;

    public async Task<LobbyDetailsDto?> Handle(Guid lobbyId, CancellationToken ct)
    {
        var lobby = await _repo.GetByIdAsync(lobbyId, ct);
        if (lobby is null) return null;

        return new LobbyDetailsDto(
            LobbyId: lobby.Id,
            GameId: lobby.GameId.ToString(),
            Status: lobby.Status.ToString(),
            IsPrivate: lobby.IsPrivate,
            HostClientId: lobby.HostClientId,
            Players: lobby.Players.Select(p => new LobbyPlayerDto(p.ClientId, p.Pseudo)).ToList(),
            CreatedAt: lobby.CreatedAt
        );
    }
}