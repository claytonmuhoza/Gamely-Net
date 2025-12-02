using GamePlatforme.domain.Entities.SpeedTyping;

namespace GamePlatform.Application.Interfaces.Repositories;
public interface ISpeedTypingGameRepository
{
    Task<SpeedTypingGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SpeedTypingGame?> GetByLobbyIdAsync(Guid lobbyId, CancellationToken cancellationToken = default);
    Task<List<SpeedTypingGame>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<List<SpeedTypingGame>> GetByPlayerIdAsync(Guid playerId, CancellationToken cancellationToken = default);
    Task<List<SpeedTypingGame>> GetInProgressGamesAsync(CancellationToken cancellationToken = default);
    Task AddAsync(SpeedTypingGame game, CancellationToken cancellationToken = default);
    Task UpdateAsync(SpeedTypingGame game, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
}