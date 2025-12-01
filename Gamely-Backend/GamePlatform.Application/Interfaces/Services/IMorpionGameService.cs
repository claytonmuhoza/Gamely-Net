namespace GamePlatform.Application.Morpion;

public interface IMorpionGameService
{
    Task<MorpionGameDto> StartGameAsync(StartMorpionGameCommand command, CancellationToken cancellationToken = default);
    Task<MorpionGameDto> PlayMoveAsync(PlayMorpionMoveCommand command, CancellationToken cancellationToken = default);
    Task<MorpionGameDto?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default);
}