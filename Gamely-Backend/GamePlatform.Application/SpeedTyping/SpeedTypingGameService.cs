using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Players;
using GamePlatforme.domain.Entities.SpeedTyping;

namespace GamePlatform.Application.SpeedTyping;

public class SpeedTypingGameService : ISpeedTypingGameService
{
    private readonly ISpeedTypingGameRepository _gameRepository;
    private readonly ITypingTextRepository _textRepository;
    private readonly IPlayerRepository _playerRepository;
    private readonly ILobbyRepository _lobbyRepository;

    public SpeedTypingGameService(
        ISpeedTypingGameRepository gameRepository,
        ITypingTextRepository textRepository,
        IPlayerRepository playerRepository,
        ILobbyRepository lobbyRepository)
    {
        _gameRepository = gameRepository;
        _textRepository = textRepository;
        _playerRepository = playerRepository;
        _lobbyRepository = lobbyRepository;
    }

    public async Task<SpeedTypingGameDto> CreateGameAsync(CreateSpeedTypingGameDto dto, CancellationToken cancellationToken = default)
    {
        // Vérifier que le lobby existe
        var lobby = await _lobbyRepository.GetByIdAsync(dto.LobbyId, cancellationToken);
        if (lobby == null)
            throw new InvalidOperationException($"Lobby {dto.LobbyId} not found");

        if (!lobby.HasStarted)
            throw new InvalidOperationException("Lobby has not started yet");

        // Vérifier qu'il n'y a pas déjà un jeu pour ce lobby
        var existingGame = await _gameRepository.GetByLobbyIdAsync(dto.LobbyId, cancellationToken);
        if (existingGame != null)
            throw new InvalidOperationException($"A game already exists for lobby {dto.LobbyId}");

        // Récupérer un texte aléatoire selon la difficulté
        if (!Enum.TryParse<TextDifficulty>(dto.TextDifficulty, true, out var difficulty))
            throw new ArgumentException($"Invalid difficulty: {dto.TextDifficulty}");

        var text = await _textRepository.GetRandomByDifficultyAsync(difficulty, "fr", cancellationToken);
        if (text == null)
            throw new InvalidOperationException($"No text found for difficulty {difficulty}");

        // Créer le jeu
        var game = new SpeedTypingGame(dto.LobbyId, text, dto.PlayerIds, dto.DurationSeconds);
        
        await _gameRepository.AddAsync(game, cancellationToken);

        return await MapToDto(game, cancellationToken);
    }

    public async Task<SpeedTypingGameDto> GetGameByIdAsync(Guid gameId, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(gameId, cancellationToken);
        if (game == null)
            throw new InvalidOperationException($"Game {gameId} not found");

        return await MapToDto(game, cancellationToken);
    }

    public async Task<SpeedTypingGameDto?> GetGameByLobbyIdAsync(Guid lobbyId, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByLobbyIdAsync(lobbyId, cancellationToken);
        if (game == null)
            return null;

        return await MapToDto(game, cancellationToken);
    }

    public async Task<List<SpeedTypingGameSummaryDto>> GetPlayerGamesAsync(Guid playerId, CancellationToken cancellationToken = default)
    {
        var games = await _gameRepository.GetByPlayerIdAsync(playerId, cancellationToken);
        
        return games.Select(g => new SpeedTypingGameSummaryDto(
            g.Id,
            g.LobbyId,
            g.PlayerProgresses.Count,
            g.Status.ToString(),
            g.StartedAt,
            g.FinishedAt.HasValue && g.StartedAt.HasValue 
                ? g.FinishedAt.Value - g.StartedAt.Value 
                : null
        )).ToList();
    }

    public async Task StartGameAsync(Guid gameId, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(gameId, cancellationToken);
        if (game == null)
            throw new InvalidOperationException($"Game {gameId} not found");

        game.Start();
        await _gameRepository.UpdateAsync(game, cancellationToken);
    }

    public async Task UpdatePlayerProgressAsync(UpdatePlayerProgressDto dto, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(dto.GameId, cancellationToken);
        if (game == null)
            throw new InvalidOperationException($"Game {dto.GameId} not found");

        game.UpdatePlayerProgress(dto.PlayerId, dto.TypedText);
        await _gameRepository.UpdateAsync(game, cancellationToken);
    }

    public async Task<PlayerProgressDto> GetPlayerProgressAsync(Guid gameId, Guid playerId, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(gameId, cancellationToken);
        if (game == null)
            throw new InvalidOperationException($"Game {gameId} not found");

        var progress = game.GetPlayerProgress(playerId);
        if (progress == null)
            throw new InvalidOperationException($"Player {playerId} not found in game");

        var player = await _playerRepository.GetByIdAsync(playerId, cancellationToken);
        var elapsed = game.StartedAt.HasValue ? DateTime.UtcNow - game.StartedAt.Value : TimeSpan.Zero;

        return new PlayerProgressDto(
            progress.PlayerId,
            player?.Pseudo ?? "Unknown",
            progress.CurrentTypedText,
            progress.CorrectCharacters,
            progress.TotalCharacters,
            progress.ErrorCount,
            progress.CalculateAccuracy(),
            progress.CalculateWPM(elapsed),
            progress.HasFinished,
            progress.FinishedAt,
            progress.CompletionTime
        );
    }

    public async Task<List<PlayerResultDto>> GetGameResultsAsync(Guid gameId, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(gameId, cancellationToken);
        if (game == null)
            throw new InvalidOperationException($"Game {gameId} not found");

        if (game.Status != SpeedTypingStatus.Finished)
            throw new InvalidOperationException("Game has not finished yet");

        var playerIds = game.Results.Select(r => r.PlayerId).ToList();
        var players = await _playerRepository.GetByIdsAsync(playerIds, cancellationToken);
        var playerDict = players.ToDictionary(p => p.Id, p => p.Pseudo);

        return game.Results.Select(r => new PlayerResultDto(
            r.PlayerId,
            playerDict.GetValueOrDefault(r.PlayerId, "Unknown"),
            r.Rank,
            r.CompletionTime,
            r.Accuracy,
            r.WPM,
            r.ErrorCount,
            r.Score
        )).ToList();
    }

    public async Task ForceFinishGameAsync(Guid gameId, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(gameId, cancellationToken);
        if (game == null)
            throw new InvalidOperationException($"Game {gameId} not found");

        game.Finish();
        await _gameRepository.UpdateAsync(game, cancellationToken);
    }

    private async Task<SpeedTypingGameDto> MapToDto(SpeedTypingGame game, CancellationToken cancellationToken)
    {
        var playerIds = game.PlayerProgresses.Select(p => p.PlayerId).ToList();
        var players = await _playerRepository.GetByIdsAsync(playerIds, cancellationToken);
        var playerDict = players.ToDictionary(p => p.Id, p => p.Pseudo);

        var elapsed = game.StartedAt.HasValue ? DateTime.UtcNow - game.StartedAt.Value : TimeSpan.Zero;

        var progressDtos = game.PlayerProgresses.Select(p => new PlayerProgressDto(
            p.PlayerId,
            playerDict.GetValueOrDefault(p.PlayerId, "Unknown"),
            p.CurrentTypedText,
            p.CorrectCharacters,
            p.TotalCharacters,
            p.ErrorCount,
            p.CalculateAccuracy(),
            p.CalculateWPM(elapsed),
            p.HasFinished,
            p.FinishedAt,
            p.CompletionTime
        )).ToList();

        var resultDtos = game.Results.Select(r => new PlayerResultDto(
            r.PlayerId,
            playerDict.GetValueOrDefault(r.PlayerId, "Unknown"),
            r.Rank,
            r.CompletionTime,
            r.Accuracy,
            r.WPM,
            r.ErrorCount,
            r.Score
        )).ToList();

        return new SpeedTypingGameDto(
            game.Id,
            game.LobbyId,
            new TypingTextDto(
                game.Text.Id,
                game.Text.Content,
                game.Text.Difficulty.ToString(),
                game.Text.WordCount,
                game.Text.Language
            ),
            game.Status.ToString(),
            game.StartedAt,
            game.FinishedAt,
            game.DurationSeconds,
            progressDtos,
            resultDtos
        );
    }
}