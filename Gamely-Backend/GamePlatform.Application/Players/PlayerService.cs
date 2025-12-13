using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Application.Interfaces.Services;
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
        if (command is null)
            throw new ArgumentNullException(nameof(command));
        var player = new Player(command.Pseudo);
        player = await _playerRepository.AddAsync(player, cancellationToken);

        return new PlayerDto
        {
            Id = player.Id,
            Pseudo = player.Pseudo
        };
    }

    public Task<Player?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("Player id is required", nameof(id));
        return _playerRepository.GetByIdAsync(id, cancellationToken);
    }
}