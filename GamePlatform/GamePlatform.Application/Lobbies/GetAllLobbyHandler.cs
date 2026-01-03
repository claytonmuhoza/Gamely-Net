using GamePlatform.Contracts.Lobbies;

namespace GamePlatform.Application.Lobbies;

public sealed class GetAllLobbyHandler
{
    private readonly ILobbyRepository _repo;

    public GetAllLobbyHandler(ILobbyRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<LobbyListItemDto>> Handle(CancellationToken ct)
    {
        var lobbies = await _repo.GetAllAsync(ct);

        return lobbies.Select(l =>
        {
            var hostPseudo = l.Players
                .FirstOrDefault(p => p.ClientId == l.HostClientId)
                ?.Pseudo ?? string.Empty;

            return new LobbyListItemDto(
                LobbyId: l.Id,
                GameId: l.GameId.ToString(),
                Status: l.Status.ToString(),
                IsPrivate: l.IsPrivate,
                PlayersCount: l.Players.Count,
                CreatedAt: l.CreatedAt,
                HostPseudo: hostPseudo
            );
        }).ToList();
    }
}