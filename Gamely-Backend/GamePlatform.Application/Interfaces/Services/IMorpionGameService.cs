using GamePlatform.Application.Morpion;

namespace GamePlatform.Application.Interfaces.Services;

public interface IMorpionGameService
{
    Task<MorpionGameDto> StartGameAsync(StartMorpionGameCommand command, CancellationToken cancellationToken = default);
    Task<MorpionGameDto> PlayMoveAsync(PlayMorpionMoveCommand command, CancellationToken cancellationToken = default);
    Task<MorpionGameDto?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default);
}