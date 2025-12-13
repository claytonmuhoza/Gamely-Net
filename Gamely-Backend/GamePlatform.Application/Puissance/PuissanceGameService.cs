using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Application.Interfaces.Services;
using GamePlatforme.domain.Entities;
using GamePlatforme.domain.Enums;


namespace GamePlatform.Application.Puissance;

public class PuissanceGameService : IPuissanceGameService
{
    private readonly ILobbyRepository _lobbyRepository;
    private readonly IPuissanceGameRepository _repository;

    public PuissanceGameService(IPuissanceGameRepository repository, ILobbyRepository lobbyRepository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _lobbyRepository = lobbyRepository ?? throw new ArgumentNullException(nameof(lobbyRepository));
    }
    
    public async Task<PuissanceGameDto> StrartGameAsync(StartPuissanceGameCommande command,
        CancellationToken cancellationToken = default)
    {
        if (command.LobbyId == Guid.Empty)
            throw new ArgumentException("LobbyId is required", nameof(command.LobbyId));
        
        var lobby = await _lobbyRepository.GetByIdAsync(command.LobbyId, cancellationToken)
                    ?? throw new InvalidOperationException("Lobby not found");
        
        if(lobby.GameType != GameType.Puissance4)
            throw new InvalidOperationException("Lobby is not a Puissance4 lobby");
        
        if (lobby.PlayerIds.Count != 2)
            throw new InvalidOperationException("Puissance requires exactly 2 players");
        
        var hostPlayerId = lobby.PlayerIds.ToList()[0];
        var otherPlayerId = lobby.PlayerIds.ToList()[1];
        
        
        var game = new PuissanceGame(lobby.Id, hostPlayerId, otherPlayerId);
        game = await _repository.AddAsync(game, cancellationToken);
        return Map(game);
    }
    
    public async Task<PuissanceGameDto> PlayMoveAsync(PlayPuissanceGameCommande command,
        CancellationToken cancellationToken = default)
    {
        if (command.GameId == Guid.Empty)
            throw new ArgumentException("GameId is required", nameof(command.GameId));

        var game = await _repository.GetByIdAsync(command.GameId, cancellationToken)
                   ?? throw new InvalidOperationException("Game not found");

        game.PlayMove(command.PlayerId, command.Column);

        await _repository.UpdateAsync(game, cancellationToken);

        return Map(game);
    }
    
    public async Task<PuissanceGameDto?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default)
    {
        var game = await _repository.GetByIdAsync(gameId, cancellationToken);
        if (game == null) return null;
        return Map(game);
    }

    private static PuissanceGameDto Map(PuissanceGame game)
    {
        return new PuissanceGameDto
        {
            Id = game.Id,
            LobbyId = game.LobbyId,
            Player1Id = game.Player1Id,
            Player2Id = game.Player2Id,
            CurrentPlayerId = game.CurrentPlayerId,
            Board = game.Board,
        };
    }
}