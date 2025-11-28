using GamePlatform.Application.Exceptions;
using GamePlatform.Application.Players;
using GamePlatforme.domain.Entities;

namespace GamePlatform.Application.Lobbies;

public class LobbyService : ILobbyService
{
    private readonly ILobbyRepository _lobbyRepository;
    private readonly IPlayerService _playerService;

    public LobbyService(ILobbyRepository lobbyRepository, IPlayerService playerService)
    {
        _lobbyRepository = lobbyRepository;
        _playerService = playerService;
    }

    public async Task<LobbyDto> CreateLobbyAsync(CreateLobbyCommand command, CancellationToken cancellationToken = default)
    {
        if (command.HostPlayerId == Guid.Empty)
        {
            throw new ApplicationValidationException(
                "Host player id is required", "LOBBY_HOST_PLAYER_REQUIRED");
        }

        var host = await _playerService.GetByIdAsync(command.HostPlayerId, cancellationToken);
        if(host == null) throw new ApplicationValidationException("Host player not found", "LOBBY_HOST_PLAYER_NOT_FOUND");
        if(command.IsPrivate && string.IsNullOrWhiteSpace(command.Password)) throw new ApplicationValidationException("Password is required", "LOBBY_PASSWORD_REQUIRED");
        var code = GenerateCode();

        var lobby = new Lobby(host.Id, command.GameType, command.IsPrivate, command.Password, code);
        lobby = await _lobbyRepository.AddAsync(lobby, cancellationToken);

        return Map(lobby);
    }

    public async Task<LobbyDto> JoinLobbyAsync(JoinLobbyCommand command, CancellationToken cancellationToken = default)
    {
        if (command.LobbyId == Guid.Empty)
        {
            throw new ApplicationValidationException(
                "Lobby id is required", "LOBBY_ID_REQUIRED");
        }

        var lobby = await _lobbyRepository.GetByIdAsync(command.LobbyId, cancellationToken) ??
                    throw new ApplicationValidationException("Lobby not found", "LOBBY_NOT_FOUND");
        if(command.PlayerId == Guid.Empty) throw new ApplicationValidationException("Player id is required", "PLAYER_ID_REQUIRED");
        var player = await _playerService.GetByIdAsync(command.PlayerId, cancellationToken)
                     ?? throw new ApplicationValidationException(
                         "Player not found",
                         "PLAYER_NOT_FOUND"
                     );
        if (!lobby.CheckPassword(command.Password))
            throw new UnauthorizedAccessException("Invalid password");

        lobby.AddPlayer(player.Id);
        await _lobbyRepository.UpdateAsync(lobby, cancellationToken);

        return Map(lobby);
    }

    public async Task<IEnumerable<LobbyDto>> GetOpenLobbiesAsync(CancellationToken cancellationToken = default)
    {
        var lobbies = await _lobbyRepository.GetOpenLobbiesAsync(cancellationToken);
        return lobbies.Select(Map).ToList();
    }

    private static LobbyDto Map(Lobby lobby)
    {
        return new LobbyDto
        {
            Id = lobby.Id,
            Code = lobby.Code,
            GameType = lobby.GameType,
            IsPrivate = lobby.IsPrivate,
            HasStarted = lobby.HasStarted,
            HostPlayerId = lobby.HostPlayerId,
            PlayerIds = lobby.PlayerIds.ToList()
        };
    }

    private string GenerateCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var rand = new Random();
        return new string(Enumerable.Range(0, 6)
            .Select(_ => chars[rand.Next(chars.Length)])
            .ToArray());
    }
}