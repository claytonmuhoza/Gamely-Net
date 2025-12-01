using GamePlatform.Application.Players;
using GamePlatforme.domain.Entities;
using GamePlatforme.domain.Enums;

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
        if (command is null)
            throw new ArgumentNullException(nameof(command));

        if (command.HostPlayerId == Guid.Empty)
            throw new ArgumentException("HostPlayerId is required", nameof(command.HostPlayerId));

        // Vérifier que l’hôte existe
        var host = await _playerService.GetByIdAsync(command.HostPlayerId, cancellationToken);
        if (host is null)
            throw new InvalidOperationException("Host player not found");

        // Règles de min/max joueurs selon le type de jeu
        var (minPlayers, maxPlayers) = GetPlayerLimits(command.GameType);

        var code = GenerateCode();

        var lobby = new Lobby(
            hostPlayerId: host.Id,
            gameType: command.GameType,
            isPrivate: command.IsPrivate,
            password: command.Password,
            code: code,
            minPlayers: minPlayers,
            maxPlayers: maxPlayers
        );

        lobby = await _lobbyRepository.AddAsync(lobby, cancellationToken);

        return Map(lobby);
    }

    public async Task<LobbyDto> JoinLobbyAsync(JoinLobbyCommand command, CancellationToken cancellationToken = default)
    {
        if (command is null)
            throw new ArgumentNullException(nameof(command));

        if (command.LobbyId == Guid.Empty)
            throw new ArgumentException("LobbyId is required", nameof(command.LobbyId));

        if (command.PlayerId == Guid.Empty)
            throw new ArgumentException("PlayerId is required", nameof(command.PlayerId));

        var lobby = await _lobbyRepository.GetByIdAsync(command.LobbyId, cancellationToken)
                    ?? throw new InvalidOperationException("Lobby not found");

        var player = await _playerService.GetByIdAsync(command.PlayerId, cancellationToken)
                     ?? throw new InvalidOperationException("Player not found");

        // Vérif mot de passe ici (règle d’orchestration)
        if (lobby.IsPrivate && !lobby.CheckPassword(command.Password))
            throw new InvalidOperationException("Invalid lobby password");

        // Ajout du joueur : c’est l’entité qui applique les règles
        // (lobby plein, joueur déjà dedans, etc.)
        lobby.AddPlayer(player.Id);

        await _lobbyRepository.UpdateAsync(lobby, cancellationToken);

        return Map(lobby);
    }

    public async Task<IEnumerable<LobbyDto>> GetOpenLobbiesAsync(CancellationToken cancellationToken = default)
    {
        var lobbies = await _lobbyRepository.GetOpenLobbiesAsync(cancellationToken);
        return lobbies.Select(Map).ToList();
    }

    // Helpers privés

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
            PlayerIds = lobby.PlayerIds.ToList(),
            MinPlayers = lobby.MinPlayers,
            MaxPlayers = lobby.MaxPlayers
        };
    }

    private (int Min, int Max) GetPlayerLimits(GameType gameType)
    {
        return gameType switch
        {
            GameType.Morpion      => (2, 2),
            GameType.Puissance4   => (2, 2),
            GameType.Mastermind   => (2, 2),
            GameType.BatailleNavale => (2, 2),

            GameType.SpeedTyping  => (2, 8),
            GameType.PetitBac     => (2, 8),
            GameType.TicTacBoom   => (2, 8),
            GameType.Labyrinthe   => (2, 4),

            _ => (2, 4)
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