using GamePlatform.Application.Games;
using GamePlatform.Application.Lobbies;
using GamePlatform.Contracts.Lobbies;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.Web.Controllers;

[ApiController]
[Route("api/lobbies")]
public sealed class LobbiesController : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CreateLobbyResponse>> Create(
        [FromBody] CreateLobbyRequest request,
        [FromServices] CreateLobbyHandler handler,
        CancellationToken ct)
    {
        var lobby = await handler.Handle(request, ct);
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var joinLink = $"{baseUrl}/join/{lobby.Id}";
        return Ok(new CreateLobbyResponse(lobby.Id, joinLink));
    }

    [HttpGet]
    public async Task<ActionResult<List<LobbyListItemDto>>> ListWaiting(
        [FromServices] ListWaitingLobbiesHandler handler,
        CancellationToken ct)
        => Ok(await handler.Handle(ct));

    [HttpGet("{lobbyId:guid}")]
    public async Task<ActionResult<LobbyDetailsDto>> Get(
        Guid lobbyId,
        [FromServices] GetLobbyDetailsHandler handler,
        CancellationToken ct)
    {
        var lobby = await handler.Handle(lobbyId, ct);
        return lobby is null ? NotFound() : Ok(lobby);
    }

    [HttpPost("{lobbyId:guid}/join")]
    public async Task<ActionResult<LobbyDetailsDto>> Join(
        Guid lobbyId,
        [FromBody] JoinLobbyRequest request,
        [FromServices] JoinLobbyHandler handler,
        [FromServices] GetLobbyDetailsHandler details,
        CancellationToken ct)
    {
        await handler.Handle(lobbyId, request, ct);
        var dto = await details.Handle(lobbyId, ct);
        return Ok(dto);
    }

    [HttpPost("{lobbyId:guid}/leave")]
    public async Task<ActionResult> Leave(
        Guid lobbyId,
        [FromBody] LeaveLobbyRequest request,
        [FromServices] LeaveLobbyHandler handler,
        CancellationToken ct)
    {
        await handler.Handle(lobbyId, request, ct);
        return NoContent();
    }

    [HttpPost("{lobbyId:guid}/start")]
    public async Task<ActionResult<object>> Start(
        Guid lobbyId,
        [FromBody] StartGameRequest request,
        [FromServices] StartGameHandler handler,
        CancellationToken ct)
    {
        
        var session = await handler.Handle(lobbyId, request, ct);
        return Ok(new { sessionId = session.Id, lobbyId = session.LobbyId, gameId = session.GameId.ToString() });
       
    }
}
