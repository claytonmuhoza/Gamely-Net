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
        var host = await _playerService.GetByIdAsync(command.HostPlayerId, cancellationToken)
                   ?? throw new InvalidOperationException("Host player not found");

        var code = GenerateCode();

        var lobby = new Lobby(host.Id, command.GameType, command.IsPrivate, command.Password, code);
        lobby = await _lobbyRepository.AddAsync(lobby, cancellationToken);

        return Map(lobby);
    }

    public async Task<LobbyDto> JoinLobbyAsync(JoinLobbyCommand command, CancellationToken cancellationToken = default)
    {
        var lobby = await _lobbyRepository.GetByIdAsync(command.LobbyId, cancellationToken)
                    ?? throw new InvalidOperationException("Lobby not found");

        var player = await _playerService.GetByIdAsync(command.PlayerId, cancellationToken)
                    ?? throw new InvalidOperationException("Player not found");

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