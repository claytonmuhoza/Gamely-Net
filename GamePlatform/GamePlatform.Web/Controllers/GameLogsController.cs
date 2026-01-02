using GamePlatform.Application.Games.Logs;
using GamePlatform.Contracts.Games.Logs;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.Web.Controllers;

[ApiController]
[Route("api/games")]
public sealed class GameLogsController : ControllerBase
{
    [HttpGet("{lobbyId:guid}/actions")]
    public async Task<ActionResult<List<GameActionLogDto>>> GetActions(
        Guid lobbyId,
        [FromServices] GetGameActionLogsHandler handler,
        CancellationToken ct)
    {
        try
        {
            return Ok(await handler.Handle(lobbyId, ct));
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(new { error = e.Message });
        }
    }
}