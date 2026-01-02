using GamePlatform.Application.Games;
using GamePlatform.Application.Games.Morpion;
using GamePlatform.Application.Games.Puissance4;
using GamePlatform.Application.Games.SpeedTyping;
using GamePlatform.Contracts.Games;
using GamePlatform.Contracts.Games.SpeedTyping;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.Web.Controllers;

[ApiController]
[Route("api/games")]
public sealed class GamesController : ControllerBase
{
    // Récupérer l'état courant (JSON) d'une partie via lobbyId
    [HttpGet("{lobbyId:guid}/state")]
    public async Task<ActionResult<object>> GetState(
        Guid lobbyId,
        [FromServices] GetCurrentGameStateHandler handler,
        CancellationToken ct)
    {
        try
        {
            var state = await handler.Handle(lobbyId, ct);
            return Ok(state);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "Game session not found" });
        }
    }

    // Jouer un coup au Morpion (index 0..8)
    [HttpPost("{lobbyId:guid}/morpion/move")]
    public async Task<IActionResult> PlayMorpionMove(
        Guid lobbyId,
        [FromBody] PlayMorpionMoveRequest request,
        [FromServices] PlayMorpionMoveHandler handler,
        CancellationToken ct)
    {
        try
        {
            await handler.Handle(lobbyId, request, ct);
            return NoContent();
        }
        catch (ArgumentException e)
        {
            return BadRequest(new { error = e.Message });
        }
        catch (InvalidOperationException e)
        {
            // ex: mauvaise phase, mauvais jeu...
            return Conflict(new { error = e.Message });
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(new { error = e.Message });
        }
    }
    [HttpPost("{lobbyId:guid}/puissance4/drop")]
    public async Task<IActionResult> DropPuissance4(
        Guid lobbyId,
        [FromBody] DropPuissance4DiscRequest request,
        [FromServices] DropPuissance4DiscHandler handler,
        CancellationToken ct)
    {
        await handler.Handle(lobbyId, request, ct);
        return NoContent();
    }
    [HttpPost("{lobbyId:guid}/speedtyping/progress")]
    public async Task<IActionResult> UpdateSpeedTypingProgress(
        Guid lobbyId,
        [FromBody] UpdateSpeedTypingProgressRequest request,
        [FromServices] UpdateSpeedTypingProgressHandler handler,
        CancellationToken ct)
    {
        await handler.Handle(lobbyId, request, ct);
        return NoContent();
    }
}