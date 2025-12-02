using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.Puissance;
using Microsoft.AspNetCore.Mvc;

namespace GamePlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PuissanceController : ControllerBase
    {
        private readonly IPuissanceGameService _puissanceGameService;

        public PuissanceController(IPuissanceGameService puissanceGameService)
        {
            _puissanceGameService = puissanceGameService;
        }

        [HttpPost("start/{lobbyId:guid}")]
        public async Task<ActionResult<PuissanceGameDto>> Start(Guid lobbyId, Guid player1Id, Guid player2Id, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _puissanceGameService.CreateAsync(lobbyId, player1Id, player2Id, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{gameId:guid}")]
        public async Task<ActionResult<PuissanceGameDto>> GetGame(Guid gameId, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _puissanceGameService.GetByIdAsync(gameId, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("{gameId:guid}/join")]
        public async Task<ActionResult> Join(Guid gameId, Guid playerId, CancellationToken cancellationToken)
        {
            try
            {
                await _puissanceGameService.JoinAsync(gameId, playerId, cancellationToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{gameId:guid}/leave")]
        public async Task<ActionResult> Leave(Guid gameId, Guid playerId, CancellationToken cancellationToken)
        {
            try
            {
                await _puissanceGameService.LeaveAsync(gameId, playerId, cancellationToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{gameId:guid}/privacy")]
        public async Task<ActionResult> SetPrivacy(Guid gameId, bool isPrivate, string? password, CancellationToken cancellationToken)
        {
            try
            {
                await _puissanceGameService.SetPrivacyAsync(gameId, isPrivate, password, cancellationToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{gameId:guid}/play")]
        public async Task<ActionResult> PlayMove(Guid gameId, Guid playerId, int column, CancellationToken cancellationToken)
        {
            try
            {
                await _puissanceGameService.PlayMoveAsync(gameId, playerId, column, cancellationToken);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{gameId:guid}/check-password")]
        public async Task<ActionResult<bool>> CheckPassword(Guid gameId, string? password, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _puissanceGameService.CheckPasswordAsync(gameId, password, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
    }
}