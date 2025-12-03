using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.SpeedTyping;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpeedTypingController : ControllerBase
{
    private readonly ISpeedTypingGameService _service;

    public SpeedTypingController(ISpeedTypingGameService service)
    {
        _service = service;
    }

    [HttpPost("start/{lobbyId:guid}")]
    public async Task<ActionResult<SpeedTypingGameDto>> Start(Guid lobbyId, [FromBody] StartSpeedTypingGameCommand? command = null)
    {
        var cmd = command ?? new StartSpeedTypingGameCommand
        {
            LobbyId = lobbyId,
            TextDifficulty = "Medium",
            DurationSeconds = 60
        };
        cmd.LobbyId = lobbyId;

        var result = await _service.StartGameAsync(cmd);
        return Ok(result);
    }

    [HttpGet("{gameId:guid}")]
    public async Task<ActionResult<SpeedTypingGameDto>> Get(Guid gameId)
    {
        var result = await _service.GetByIdAsync(gameId);
        if (result is null) return NotFound();
        return Ok(result);
    }
}