using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.Lobbies;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LobbyController : ControllerBase
{
    private readonly ILobbyService _lobbyService;

    public LobbyController(ILobbyService lobbyService)
    {
        _lobbyService = lobbyService;
    }

    [HttpPost]
    public async Task<ActionResult<LobbyDto>> CreateLobby([FromBody] CreateLobbyCommand command)
    {
        var result = await _lobbyService.CreateLobbyAsync(command);
        return Ok(result);
    }

    [HttpPost("{lobbyId:guid}/join")]
    public async Task<ActionResult<LobbyDto>> JoinLobby(Guid lobbyId, [FromBody] JoinLobbyCommand command)
    {
        command.LobbyId = lobbyId;
        var result = await _lobbyService.JoinLobbyAsync(command);
        return Ok(result);
    }

    [HttpGet("open")]
    public async Task<ActionResult<IEnumerable<LobbyDto>>> GetOpenLobbies()
    {
        var result = await _lobbyService.GetOpenLobbiesAsync();
        return Ok(result);
    }
}