using GamePlatform.Application.Interfaces.Players;
using GamePlatform.Application.Players;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly IPlayerService _playerService;

    public PlayerController(IPlayerService playerService)
    {
        _playerService = playerService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<PlayerDto>> Register([FromBody] RegisterPlayerCommand command)
    {
        var result = await _playerService.RegisterAsync(command);
        return Ok(result);
    }
}