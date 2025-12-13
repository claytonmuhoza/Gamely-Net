using GamePlatform.Application.Lobbies;

namespace GamePlatform.Application.Interfaces.Services;

public interface ILobbyService
{
    Task<LobbyDto> CreateLobbyAsync(CreateLobbyCommand command, CancellationToken cancellationToken = default);
    Task<LobbyDto> JoinLobbyAsync(JoinLobbyCommand command, CancellationToken cancellationToken = default);
    Task<IEnumerable<LobbyDto>> GetOpenLobbiesAsync(CancellationToken cancellationToken = default);
}