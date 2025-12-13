using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.SpeedTyping;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.API.Hubs;

public class SpeedTypingHub : Hub
{
    private readonly ISpeedTypingGameService _service;
    private readonly ILogger<SpeedTypingHub> _logger;

    public SpeedTypingHub(ISpeedTypingGameService service, ILogger<SpeedTypingHub> logger)
    {
        _service = service;
        _logger = logger;
    }

    public async Task JoinGame(Guid gameId, Guid playerId)
    {
        try
        {
            _logger.LogInformation("[SpeedTypingHub] JoinGame - GameId: {GameId}, PlayerId: {PlayerId}", gameId, playerId);

            var game = await _service.GetByIdAsync(gameId);
            if (game is null)
            {
                _logger.LogWarning("[SpeedTypingHub] Game not found: {GameId}", gameId);
                await Clients.Caller.SendAsync("Error", "Game not found");
                return;
            }

            var groupName = gameId.ToString();
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            
            _logger.LogInformation("[SpeedTypingHub] Player {PlayerId} joined game {GameId}", playerId, gameId);
            
            await Clients.Caller.SendAsync("GameState", game);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SpeedTypingHub] Error in JoinGame");
            await Clients.Caller.SendAsync("Error", $"Unexpected error: {ex.Message}");
        }
    }

    public async Task StartGame(Guid gameId)
    {
        
        try
        {
            _logger.LogInformation("[SpeedTypingHub] StartGame called for GameId: {GameId}", gameId);

            // ✅ Utilise bien la deuxième méthode StartGameAsync(Guid)
            var startedGame = await _service.StartGameAsync(gameId);
        
            if (startedGame is null)
            {
                _logger.LogWarning("[SpeedTypingHub] Failed to start game: {GameId}", gameId);
                await Clients.Caller.SendAsync("Error", "Failed to start game");
                return;
            }

            _logger.LogInformation("[SpeedTypingHub] Game started successfully - GameId: {GameId}, Status: {Status}", 
                gameId, startedGame.Status);

            var groupName = gameId.ToString();
        
            await Clients.Group(groupName).SendAsync("GameStarted", startedGame);
            await Clients.Group(groupName).SendAsync("GameUpdated", startedGame);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SpeedTypingHub] Error starting game {GameId}", gameId);
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }

    public async Task UpdateProgress(Guid gameId, Guid playerId, string typedText)
    {
        try
        {
            var command = new UpdateProgressCommand
            {
                GameId = gameId,
                PlayerId = playerId,
                TypedText = typedText
            };

            var updatedGame = await _service.UpdateProgressAsync(command);
            var groupName = gameId.ToString();
            await Clients.Group(groupName).SendAsync("GameUpdated", updatedGame);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SpeedTypingHub] Error updating progress");
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("[SpeedTypingHub] Client disconnected: {ConnectionId}", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}