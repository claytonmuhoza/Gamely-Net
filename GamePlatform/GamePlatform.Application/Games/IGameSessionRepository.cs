using GamePlatform.Domain;

namespace GamePlatform.Application.Games;

public interface IGameSessionRepository
{
    Task AddAsync(GameSession session, CancellationToken ct);
    Task<GameSession?> GetByLobbyIdAsync(Guid lobbyId, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}