using GamePlatform.Application.Morpion;
using Microsoft.AspNetCore.SignalR;

namespace GamePlatform.API.Hubs;

public class MorpionHub : Hub
{
    private readonly IMorpionGameService _morpionService;

    public MorpionHub(IMorpionGameService morpionService)
    {
        _morpionService = morpionService;
    }

    /// <summary>
    /// Un client appelle cette méthode pour rejoindre le "groupe" d'une partie.
    /// Cela permet de recevoir les mises à jour en temps réel.
    /// </summary>
    public async Task JoinGame(Guid gameId, Guid playerId)
    {
        try
        {
            var game = await _morpionService.GetByIdAsync(gameId);
            if (game is null)
            {
                await Clients.Caller.SendAsync("Error", "Game not found");
                return;
            }

            // Optionnel : vérifier côté hub que le joueur fait partie de la partie
            if (playerId != game.PlayerXId && playerId != game.PlayerOId)
            {
                await Clients.Caller.SendAsync("Error", "You are not a player in this game");
                return;
            }

            var groupName = gameId.ToString();

            // Ajouter cette connexion au groupe SignalR
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            // Envoyer l'état actuel de la partie au joueur qui vient de rejoindre
            await Clients.Caller.SendAsync("GameState", game);
        }
        catch (Exception ex)
        {
            // Erreur inattendue côté serveur
            await Clients.Caller.SendAsync("Error", $"Unexpected error: {ex.Message}");
        }
    }

    /// <summary>
    /// Jouer un coup en temps réel.
    /// Tous les joueurs du groupe reçoivent le nouvel état de la partie.
    /// </summary>
    public async Task PlayMove(Guid gameId, Guid playerId, int row, int col)
    {
        try
        {
            var command = new PlayMorpionMoveCommand
            {
                GameId = gameId,
                PlayerId = playerId,
                Row = row,
                Col = col
            };

            var updatedGame = await _morpionService.PlayMoveAsync(command);

            var groupName = gameId.ToString();

            // Diffuser le nouvel état à tous les clients dans la partie
            await Clients.Group(groupName).SendAsync("GameUpdated", updatedGame);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", new
            {
                message = "Unexpected server error",
                detail = ex.Message
            });
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Ici tu peux plus tard gérer les déconnexions (ex: log, état joueur, etc.)
        await base.OnDisconnectedAsync(exception);
    }
}