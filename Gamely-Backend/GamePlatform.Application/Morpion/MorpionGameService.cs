using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Application.Lobbies;
using GamePlatforme.domain.Entities;
using GamePlatforme.domain.Enums;

namespace GamePlatform.Application.Morpion;

public class MorpionGameService : IMorpionGameService
{
    private readonly IMorpionGameRepository _morpionRepo;
    private readonly ILobbyRepository _lobbyRepository;

    public MorpionGameService(IMorpionGameRepository morpionRepo, ILobbyRepository lobbyRepository)
    {
        _morpionRepo = morpionRepo;
        _lobbyRepository = lobbyRepository;
    }

    public async Task<MorpionGameDto> StartGameAsync(StartMorpionGameCommand command, CancellationToken cancellationToken = default)
    {
        if (command.LobbyId == Guid.Empty)
            throw new ArgumentException("LobbyId is required", nameof(command.LobbyId));

        var lobby = await _lobbyRepository.GetByIdAsync(command.LobbyId, cancellationToken)
                    ?? throw new InvalidOperationException("Lobby not found");

        if (lobby.GameType != GameType.Morpion)
            throw new InvalidOperationException("Lobby is not a Morpion lobby");

        if (lobby.PlayerIds.Count != 2)
            throw new InvalidOperationException("Morpion requires exactly 2 players");

        var playerXId = lobby.HostPlayerId;
        var playerOId = lobby.PlayerIds.First(id => id != playerXId);

        var game = new MorpionGame(lobby.Id, playerXId, playerOId);
        game = await _morpionRepo.AddAsync(game, cancellationToken);

        return Map(game);
    }

    public async Task<MorpionGameDto> PlayMoveAsync(PlayMorpionMoveCommand command, CancellationToken cancellationToken = default)
    {
        if (command.GameId == Guid.Empty)
            throw new ArgumentException("GameId is required", nameof(command.GameId));

        var game = await _morpionRepo.GetByIdAsync(command.GameId, cancellationToken)
                   ?? throw new InvalidOperationException("Game not found");

        game.PlayMove(command.PlayerId, command.Row, command.Col);

        await _morpionRepo.UpdateAsync(game, cancellationToken);

        return Map(game);
    }

    public async Task<MorpionGameDto?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default)
    {
        var game = await _morpionRepo.GetByIdAsync(gameId, cancellationToken);
        return game is null ? null : Map(game);
    }

    private static MorpionGameDto Map(MorpionGame game)
    {
        return new MorpionGameDto
        {
            Id = game.Id,
            LobbyId = game.LobbyId,
            Board = game.Board,
            PlayerXId = game.PlayerXId,
            PlayerOId = game.PlayerOId,
            CurrentPlayerId = game.CurrentPlayerId,
            WinnerPlayerId = game.WinnerPlayerId,
            IsFinished = game.IsFinished,
            IsDraw = game.IsDraw
        };
    }
}