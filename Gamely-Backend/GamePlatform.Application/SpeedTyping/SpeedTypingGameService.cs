using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Application.Interfaces.Services;
using GamePlatforme.domain.Entities.SpeedTyping;
using GamePlatforme.domain.Enums;

namespace GamePlatform.Application.SpeedTyping;
public class SpeedTypingGameService : ISpeedTypingGameService
{
    private readonly ISpeedTypingGameRepository _gameRepo;
    private readonly ITypingTextRepository _textRepo;
    private readonly ILobbyRepository _lobbyRepo;
    private readonly IPlayerRepository _playerRepo;

    public SpeedTypingGameService(
        ISpeedTypingGameRepository gameRepo,
        ITypingTextRepository textRepo,
        ILobbyRepository lobbyRepo,
        IPlayerRepository playerRepo)
    {
        _gameRepo = gameRepo;
        _textRepo = textRepo;
        _lobbyRepo = lobbyRepo;
        _playerRepo = playerRepo;
    }

    public async Task<SpeedTypingGameDto> StartGameAsync(StartSpeedTypingGameCommand command, CancellationToken cancellationToken = default)
    {
        if (command.LobbyId == Guid.Empty)
            throw new ArgumentException("LobbyId is required", nameof(command.LobbyId));

        var lobby = await _lobbyRepo.GetByIdAsync(command.LobbyId, cancellationToken)
                    ?? throw new InvalidOperationException("Lobby not found");

        if (lobby.GameType != GameType.SpeedTyping)
            throw new InvalidOperationException("Lobby is not a SpeedTyping lobby");

        if (!Enum.TryParse<TextDifficulty>(command.TextDifficulty, true, out var difficulty))
            difficulty = TextDifficulty.Medium;

        var text = await _textRepo.GetRandomByDifficultyAsync(difficulty, "fr", cancellationToken)
                   ?? throw new InvalidOperationException($"No text found for difficulty {difficulty}");

        var game = new SpeedTypingGame(lobby.Id, text, lobby.PlayerIds, command.DurationSeconds);
        game = await _gameRepo.AddAsync(game, cancellationToken);

        return await MapToDto(game, cancellationToken);
    }

    public async Task<SpeedTypingGameDto?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepo.GetByIdAsync(gameId, cancellationToken);
        return game is null ? null : await MapToDto(game, cancellationToken);
    }

    public async Task<SpeedTypingGameDto> UpdateProgressAsync(UpdateProgressCommand command, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepo.GetByIdAsync(command.GameId, cancellationToken)
                   ?? throw new InvalidOperationException("Game not found");

        game.UpdatePlayerProgress(command.PlayerId, command.TypedText);
        await _gameRepo.UpdateAsync(game, cancellationToken);

        return await MapToDto(game, cancellationToken);
    }

    private async Task<SpeedTypingGameDto> MapToDto(SpeedTypingGame game, CancellationToken cancellationToken)
    {
        var playerIds = game.PlayerProgresses.Select(p => p.PlayerId).ToList();
        var players = await _playerRepo.GetByIdsAsync(playerIds, cancellationToken);
        var playerDict = players.ToDictionary(p => p.Id, p => p.Pseudo);

        var elapsed = game.StartedAt.HasValue ? DateTime.UtcNow - game.StartedAt.Value : TimeSpan.Zero;

        return new SpeedTypingGameDto
        {
            Id = game.Id,
            LobbyId = game.LobbyId,
            Text = new TypingTextDto
            {
                Id = game.Text.Id,
                Content = game.Text.Content,
                Difficulty = game.Text.Difficulty.ToString(),
                WordCount = game.Text.WordCount,
                Language = game.Text.Language
            },
            Status = game.Status.ToString(),
            StartedAt = game.StartedAt,
            FinishedAt = game.FinishedAt,
            DurationSeconds = game.DurationSeconds,
            PlayerProgresses = game.PlayerProgresses.Select(p => new PlayerProgressDto
            {
                PlayerId = p.PlayerId,
                PlayerPseudo = playerDict.GetValueOrDefault(p.PlayerId, "Unknown"),
                CurrentTypedText = p.CurrentTypedText,
                CorrectCharacters = p.CorrectCharacters,
                TotalCharacters = p.TotalCharacters,
                ErrorCount = p.ErrorCount,
                Accuracy = p.CalculateAccuracy(),
                CurrentWPM = p.CalculateWPM(elapsed),
                HasFinished = p.HasFinished,
                FinishedAt = p.FinishedAt,
                CompletionTime = p.CompletionTime
            }).ToList(),
            Results = game.Results.Select(r => new PlayerResultDto
            {
                PlayerId = r.PlayerId,
                PlayerPseudo = playerDict.GetValueOrDefault(r.PlayerId, "Unknown"),
                Rank = r.Rank,
                CompletionTime = r.CompletionTime,
                Accuracy = r.Accuracy,
                WPM = r.WPM,
                ErrorCount = r.ErrorCount,
                Score = r.Score
            }).ToList()
        };
    }
}