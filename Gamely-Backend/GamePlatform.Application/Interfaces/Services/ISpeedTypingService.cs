using GamePlatform.Application.SpeedTyping;

namespace GamePlatform.Application.Interfaces.Services;

public interface ISpeedTypingGameService
{
    Task<SpeedTypingGameDto> StartGameAsync(StartSpeedTypingGameCommand command, CancellationToken cancellationToken = default);
    Task<SpeedTypingGameDto?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default);
    Task<SpeedTypingGameDto> UpdateProgressAsync(UpdateProgressCommand command, CancellationToken cancellationToken = default);
}



