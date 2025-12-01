using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Players;

public interface IPlayerService {
    Task<PlayerDto> RegisterAsync(RegisterPlayerCommand command, CancellationToken cancellationToken = default);
    Task<Player?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}