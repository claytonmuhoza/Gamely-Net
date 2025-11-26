using GamePlatform.Application.Exceptions;
using GamePlatforme.domain.Entities;
namespace GamePlatform.Application.Players;

public class PlayerService : IPlayerService {
    private readonly IPlayerRepository _playerRepository;

    public PlayerService(IPlayerRepository playerRepository)
    {
        _playerRepository = playerRepository;
    }

    public async Task<PlayerDto> RegisterAsync(RegisterPlayerCommand command, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(command.Pseudo)) throw new ApplicationValidationException("Pseudo is required", "PLAYER_PSEUDO_REQUIRED");
        
            var player = new Player(command.Pseudo);
            player = await _playerRepository.AddAsync(player, cancellationToken);

            return new PlayerDto
            {
                Id = player.Id,
                Pseudo = player.Pseudo
            };
        
    }

    public Task<Player?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _playerRepository.GetByIdAsync(id, cancellationToken);
}