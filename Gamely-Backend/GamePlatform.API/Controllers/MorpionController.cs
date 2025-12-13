using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.Morpion;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MorpionController : ControllerBase
{
    private readonly IMorpionGameService _morpionService;

    public MorpionController(IMorpionGameService morpionService)
    {
        _morpionService = morpionService;
    }

    [HttpPost("start/{lobbyId:guid}")]
    public async Task<ActionResult<MorpionGameDto>> Start(Guid lobbyId)
    {
        var cmd = new StartMorpionGameCommand
        {
            LobbyId = lobbyId
        };

        var result = await _morpionService.StartGameAsync(cmd);
        return Ok(result);
    }

    [HttpPost("{gameId:guid}/move")]
    public async Task<ActionResult<MorpionGameDto>> PlayMove(Guid gameId, [FromBody] PlayMorpionMoveCommand command)
    {
        command.GameId = gameId;
        var result = await _morpionService.PlayMoveAsync(command);
        return Ok(result);
    }

    [HttpGet("{gameId:guid}")]
    public async Task<ActionResult<MorpionGameDto>> Get(Guid gameId)
    {
        var result = await _morpionService.GetByIdAsync(gameId);
        if (result is null) return NotFound();
        return Ok(result);
    }
}