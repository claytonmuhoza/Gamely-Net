using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.SpeedTyping;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.API.Hubs;

public class SpeedTypingHub : Hub
{
    private readonly ISpeedTypingGameService _service;

    public SpeedTypingHub(ISpeedTypingGameService service)
    {
        _service = service;
    }

    public async Task JoinGame(Guid gameId, Guid playerId)
    {
        try
        {
            var game = await _service.GetByIdAsync(gameId);
            if (game is null)
            {
                await Clients.Caller.SendAsync("Error", "Game not found");
                return;
            }

            var groupName = gameId.ToString();
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Caller.SendAsync("GameState", game);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Unexpected error: {ex.Message}");
        }
    }

    public async Task StartGame(Guid gameId)
    {
        try
        {
            var game = await _service.GetByIdAsync(gameId);
            if (game is null)
            {
                await Clients.Caller.SendAsync("Error", "Game not found");
                return;
            }

            // Start game logic
            var groupName = gameId.ToString();
            await Clients.Group(groupName).SendAsync("GameStarted", game);
        }
        catch (Exception ex)
        {
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
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }
}
