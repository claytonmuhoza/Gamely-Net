using GamePlatform.Application.Players;
using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Interfaces.Services;

public interface IPlayerService {
    Task<PlayerDto> RegisterAsync(RegisterPlayerCommand command, CancellationToken cancellationToken = default);
    Task<Player?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}