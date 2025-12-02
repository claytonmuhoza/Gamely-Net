using GamePlatform.Application.Interfaces.Services;
using GamePlatform.Application.SpeedTyping;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.API.Hubs;
public class SpeedTypingHub : Hub
{
    private readonly ISpeedTypingGameService _gameService;

    public SpeedTypingHub(ISpeedTypingGameService gameService)
    {
        _gameService = gameService;
    }

    /// <summary>
    /// Rejoindre une partie (groupe SignalR)
    /// </summary>
    public async Task JoinGame(Guid gameId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, GetGameGroup(gameId));
        
        // Envoyer l'état actuel du jeu au joueur qui rejoint
        try
        {
            var game = await _gameService.GetGameByIdAsync(gameId);
            await Clients.Caller.SendAsync("GameState", game);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", new { message = ex.Message });
        }
    }

    /// <summary>
    /// Quitter une partie
    /// </summary>
    public async Task LeaveGame(Guid gameId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGameGroup(gameId));
    }

    /// <summary>
    /// Démarrer la partie (Host uniquement)
    /// </summary>
    public async Task StartGame(Guid gameId)
    {
        try
        {
            await _gameService.StartGameAsync(gameId);
            
            var game = await _gameService.GetGameByIdAsync(gameId);
            
            // Notifier tous les joueurs que la partie commence
            await Clients.Group(GetGameGroup(gameId))
                .SendAsync("GameStarted", new
                {
                    gameId = game.Id,
                    startedAt = game.StartedAt,
                    text = game.Text,
                    durationSeconds = game.DurationSeconds
                });
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", new { message = ex.Message });
        }
    }

    /// <summary>
    /// Mise à jour de la progression du joueur en temps réel
    /// </summary>
    public async Task UpdateProgress(Guid gameId, Guid playerId, string typedText)
    {
        try
        {
            var dto = new UpdatePlayerProgressDto(gameId, playerId, typedText);
            await _gameService.UpdatePlayerProgressAsync(dto);
            
            var progress = await _gameService.GetPlayerProgressAsync(gameId, playerId);
            
            // Notifier tous les joueurs de la progression mise à jour
            await Clients.Group(GetGameGroup(gameId))
                .SendAsync("PlayerProgressUpdated", progress);

            // Si le joueur a terminé, notifier spécifiquement
            if (progress.HasFinished)
            {
                await Clients.Group(GetGameGroup(gameId))
                    .SendAsync("PlayerFinished", new
                    {
                        playerId = progress.PlayerId,
                        playerPseudo = progress.PlayerPseudo,
                        completionTime = progress.CompletionTime,
                        accuracy = progress.Accuracy,
                        wpm = progress.CurrentWPM
                    });
            }
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", new { message = ex.Message });
        }
    }

    /// <summary>
    /// Récupérer les résultats finaux
    /// </summary>
    public async Task GetResults(Guid gameId)
    {
        try
        {
            var results = await _gameService.GetGameResultsAsync(gameId);
            
            // Envoyer les résultats à tous les joueurs
            await Clients.Group(GetGameGroup(gameId))
                .SendAsync("GameResults", results);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", new { message = ex.Message });
        }
    }

    /// <summary>
    /// Demander l'état actuel du jeu
    /// </summary>
    public async Task RequestGameState(Guid gameId)
    {
        try
        {
            var game = await _gameService.GetGameByIdAsync(gameId);
            await Clients.Caller.SendAsync("GameState", game);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", new { message = ex.Message });
        }
    }

    /// <summary>
    /// Timer côté serveur pour synchroniser le compte à rebours
    /// </summary>
    public async Task StartCountdown(Guid gameId, int seconds)
    {
        for (int i = seconds; i > 0; i--)
        {
            await Clients.Group(GetGameGroup(gameId))
                .SendAsync("CountdownTick", i);
            await Task.Delay(1000);
        }
        
        await Clients.Group(GetGameGroup(gameId))
            .SendAsync("CountdownFinished");
    }

    /// <summary>
    /// Notifier que le temps est écoulé
    /// </summary>
    public async Task NotifyTimeUp(Guid gameId)
    {
        try
        {
            await _gameService.ForceFinishGameAsync(gameId);
            
            var results = await _gameService.GetGameResultsAsync(gameId);
            
            await Clients.Group(GetGameGroup(gameId))
                .SendAsync("TimeUp", new
                {
                    message = "Le temps est écoulé !",
                    results
                });
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", new { message = ex.Message });
        }
    }

    private static string GetGameGroup(Guid gameId) => $"game_{gameId}";

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Logique de déconnexion si nécessaire
        await base.OnDisconnectedAsync(exception);
    }
}