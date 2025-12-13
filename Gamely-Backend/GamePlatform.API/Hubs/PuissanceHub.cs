// csharp
        using GamePlatform.Application.Interfaces.Services;
        using GamePlatform.Application.Puissance;
        using Microsoft.AspNetCore.SignalR;
        using Microsoft.Extensions.Logging;
        
        namespace GamePlatform.API.Hubs;
        
        public class PuissanceHub : Hub
        {
            private readonly IPuissanceGameService _puissanceGameService;
            private readonly ILogger<PuissanceHub> _logger;
        
            public PuissanceHub(IPuissanceGameService puissanceGameService, ILogger<PuissanceHub> logger)
            {
                _puissanceGameService = puissanceGameService;
                _logger = logger;
            }
        
            public async Task JoinGame(Guid gameId, Guid playerId)
            {
                try
                {
                    var game = await _puissanceGameService.GetByIdAsync(gameId);
                    if (game is null)
                    {
                        await Clients.Caller.SendAsync("Error", "Game not found");
                        return;
                    }
        
                    if (playerId != game.Player1Id && playerId != game.Player2Id)
                    {
                        await Clients.Caller.SendAsync("Error", "You are not a player in this game");
                        return;
                    }
        
                    var groupName = gameId.ToString();
                    await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                    await Clients.Caller.SendAsync("GameState", game);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "JoinGame failed for gameId={GameId} playerId={PlayerId}", gameId, playerId);
                    await Clients.Caller.SendAsync("Error", "Unexpected server error");
                }
            }
        
            public async Task PlayMove(Guid gameId, Guid playerId, int column, CancellationToken cancellationToken)
            {
                // validation basique côté hub pour renvoyer des erreurs claires au client
                if (gameId == Guid.Empty)
                {
                    await Clients.Caller.SendAsync("Error", "Invalid game id");
                    return;
                }
        
                if (playerId == Guid.Empty)
                {
                    await Clients.Caller.SendAsync("Error", "Invalid player id");
                    return;
                }
        
                if (column < 0 || column > 6) // bornes pour Puissance-4 0..6
                {
                    await Clients.Caller.SendAsync("Error", "Column out of range");
                    return;
                }
        
                var playMoveCommand = new PlayPuissanceGameCommande
                {
                    GameId = gameId,
                    PlayerId = playerId,
                    Column = column
                };
        
                try
                {
                    var updatedGame = await _puissanceGameService.PlayMoveAsync(playMoveCommand, cancellationToken);
                    var groupName = gameId.ToString();
                    await Clients.Group(groupName).SendAsync("GameUpdated", updatedGame);
                }
                catch (Exception ex)
                {
                    // log détaillé côté serveur
                    _logger.LogWarning(ex, "PlayMove failed for gameId={GameId} playerId={PlayerId} column={Column}", gameId, playerId, column);
        
                    // si l'exception contient un message utile (validation métier), le renvoyer sinon message générique
                    var message = string.IsNullOrWhiteSpace(ex.Message) ? "Unexpected server error" : ex.Message;
                    await Clients.Caller.SendAsync("Error", message);
                }
            }
        
            public override async Task OnDisconnectedAsync(Exception? exception)
            {
                if (exception != null)
                    _logger.LogInformation(exception, "Connection disconnected with error");
        
                await base.OnDisconnectedAsync(exception);
            }
        }