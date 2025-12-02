using GamePlatform.Application.SpeedTyping;

namespace GamePlatform.Application.Interfaces.Services;

public interface ISpeedTypingGameService
{
    Task<SpeedTypingGameDto> CreateGameAsync(CreateSpeedTypingGameDto dto, CancellationToken cancellationToken = default);
    Task<SpeedTypingGameDto> GetGameByIdAsync(Guid gameId, CancellationToken cancellationToken = default);
    Task<SpeedTypingGameDto?> GetGameByLobbyIdAsync(Guid lobbyId, CancellationToken cancellationToken = default);
    Task<List<SpeedTypingGameSummaryDto>> GetPlayerGamesAsync(Guid playerId, CancellationToken cancellationToken = default);
    Task StartGameAsync(Guid gameId, CancellationToken cancellationToken = default);
    Task UpdatePlayerProgressAsync(UpdatePlayerProgressDto dto, CancellationToken cancellationToken = default);
    Task<PlayerProgressDto> GetPlayerProgressAsync(Guid gameId, Guid playerId, CancellationToken cancellationToken = default);
    Task<List<PlayerResultDto>> GetGameResultsAsync(Guid gameId, CancellationToken cancellationToken = default);
    Task ForceFinishGameAsync(Guid gameId, CancellationToken cancellationToken = default);
}
