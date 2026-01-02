using GamePlatform.Application.Scores;
using GamePlatform.Contracts.Scores;
using GamePlatform.Domain;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.Web.Controllers;

[ApiController]
[Route("api/scores")]
public sealed class ScoresController : ControllerBase
{
    [HttpGet("top")]
    public async Task<ActionResult<List<ScoreEntryDto>>> Top(
        [FromQuery] string gameId,
        [FromQuery] int limit,
        [FromServices] ScoreService scores,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(gameId))
            return BadRequest(new { error = "gameId is required" });

        if (!Enum.TryParse<GameId>(gameId, ignoreCase: true, out var gid))
            return BadRequest(new { error = "invalid gameId" });

        if (limit <= 0) limit = 10;
        if (limit > 100) limit = 100;

        var list = await scores.GetTopAsync(gid, limit, ct);
        return Ok(list);
    }
}