using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Interfaces.Services;

public interface IPuissanceGameService
{
    Task<PuissanceGame> CreateAsync(Guid lobbyId, Guid player1Id, Guid player2Id, CancellationToken cancellationToken = default);

    Task<PuissanceGame?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default);

    Task JoinAsync(Guid gameId, Guid playerId, CancellationToken cancellationToken = default);

    Task LeaveAsync(Guid gameId, Guid playerId, CancellationToken cancellationToken = default);

    Task SetPrivacyAsync(Guid gameId, bool isPrivate, string? password, CancellationToken cancellationToken = default);

    Task PlayMoveAsync(Guid gameId, Guid playerId, int column, CancellationToken cancellationToken = default);

    Task<bool> CheckPasswordAsync(Guid gameId, string? password, CancellationToken cancellationToken = default);

    Task SaveAsync(PuissanceGame game, CancellationToken cancellationToken = default);
}