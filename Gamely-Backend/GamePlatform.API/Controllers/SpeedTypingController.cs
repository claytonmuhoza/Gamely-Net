using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.SpeedTyping;
using Microsoft.AspNetCore.Mvc;

namespace  GamePlatform.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class SpeedTypingController : ControllerBase
{
    private readonly ISpeedTypingGameService _gameService;
    private readonly ITypingTextService _textService;

    public SpeedTypingController(
        ISpeedTypingGameService gameService,
        ITypingTextService textService)
    {
        _gameService = gameService;
        _textService = textService;
    }

    /// <summary>
    /// Créer une nouvelle partie de Speed Typing
    /// </summary>
    [HttpPost("games")]
    [ProducesResponseType(typeof(SpeedTypingGameDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SpeedTypingGameDto>> CreateGame(
        [FromBody] CreateSpeedTypingGameDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var game = await _gameService.CreateGameAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Récupérer une partie par son ID
    /// </summary>
    [HttpGet("games/{id}")]
    [ProducesResponseType(typeof(SpeedTypingGameDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpeedTypingGameDto>> GetGame(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var game = await _gameService.GetGameByIdAsync(id, cancellationToken);
            return Ok(game);
        }
        catch (InvalidOperationException)
        {
            return NotFound(new { error = $"Game {id} not found" });
        }
    }

    /// <summary>
    /// Récupérer une partie par l'ID du lobby
    /// </summary>
    [HttpGet("games/lobby/{lobbyId}")]
    [ProducesResponseType(typeof(SpeedTypingGameDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpeedTypingGameDto>> GetGameByLobby(
        Guid lobbyId,
        CancellationToken cancellationToken)
    {
        var game = await _gameService.GetGameByLobbyIdAsync(lobbyId, cancellationToken);
        if (game == null)
            return NotFound(new { error = $"No game found for lobby {lobbyId}" });

        return Ok(game);
    }

    /// <summary>
    /// Récupérer toutes les parties d'un joueur
    /// </summary>
    [HttpGet("games/player/{playerId}")]
    [ProducesResponseType(typeof(List<SpeedTypingGameSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<SpeedTypingGameSummaryDto>>> GetPlayerGames(
        Guid playerId,
        CancellationToken cancellationToken)
    {
        var games = await _gameService.GetPlayerGamesAsync(playerId, cancellationToken);
        return Ok(games);
    }

    /// <summary>
    /// Démarrer une partie
    /// </summary>
    [HttpPost("games/{id}/start")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> StartGame(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            await _gameService.StartGameAsync(id, cancellationToken);
            return Ok(new { message = "Game started successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Forcer la fin d'une partie
    /// </summary>
    [HttpPost("games/{id}/finish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> FinishGame(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            await _gameService.ForceFinishGameAsync(id, cancellationToken);
            return Ok(new { message = "Game finished successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Récupérer la progression d'un joueur
    /// </summary>
    [HttpGet("games/{gameId}/players/{playerId}/progress")]
    [ProducesResponseType(typeof(PlayerProgressDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PlayerProgressDto>> GetPlayerProgress(
        Guid gameId,
        Guid playerId,
        CancellationToken cancellationToken)
    {
        try
        {
            var progress = await _gameService.GetPlayerProgressAsync(gameId, playerId, cancellationToken);
            return Ok(progress);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Récupérer les résultats d'une partie terminée
    /// </summary>
    [HttpGet("games/{id}/results")]
    [ProducesResponseType(typeof(List<PlayerResultDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<PlayerResultDto>>> GetGameResults(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await _gameService.GetGameResultsAsync(id, cancellationToken);
            return Ok(results);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Récupérer un texte aléatoire selon la difficulté
    /// </summary>
    [HttpGet("texts/random")]
    [ProducesResponseType(typeof(TypingTextDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TypingTextDto>> GetRandomText(
        [FromQuery] string difficulty = "Medium",
        [FromQuery] string language = "fr",
        CancellationToken cancellationToken = default)
    {
        try
        {
            var text = await _textService.GetRandomTextAsync(difficulty, language, cancellationToken);
            return Ok(text);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Récupérer tous les textes
    /// </summary>
    [HttpGet("texts")]
    [ProducesResponseType(typeof(List<TypingTextDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TypingTextDto>>> GetAllTexts(
        CancellationToken cancellationToken)
    {
        var texts = await _textService.GetAllTextsAsync(cancellationToken);
        return Ok(texts);
    }

    /// <summary>
    /// Récupérer les textes par difficulté
    /// </summary>
    [HttpGet("texts/difficulty/{difficulty}")]
    [ProducesResponseType(typeof(List<TypingTextDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TypingTextDto>>> GetTextsByDifficulty(
        string difficulty,
        CancellationToken cancellationToken)
    {
        try
        {
            var texts = await _textService.GetTextsByDifficultyAsync(difficulty, cancellationToken);
            return Ok(texts);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Créer un nouveau texte (admin)
    /// </summary>
    [HttpPost("texts")]
    [ProducesResponseType(typeof(TypingTextDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TypingTextDto>> CreateText(
        [FromBody] CreateTypingTextDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var text = await _textService.CreateTextAsync(
                dto.Content,
                dto.Difficulty,
                dto.Language,
                cancellationToken);
            return CreatedAtAction(nameof(GetRandomText), text);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public record CreateTypingTextDto(string Content, string Difficulty, string Language = "fr");
