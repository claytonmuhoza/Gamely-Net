using GamePlatform.Application.Interfaces.Services;
using GamePlatforme.domain.Entities;
using GamePlatform.Application.Lobbies;


namespace GamePlatform.Application.Puissance;

public class PuissanceGameService : IPuissanceGameService
{
    private readonly ILobbyRepository _lobbyRepository;
    private readonly IPuissanceGameRepository _repository;

    public PuissanceGameService(IPuissanceGameRepository repository, ILobbyRepository lobbyRepository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _lobbyRepository = lobbyRepository ?? throw new ArgumentNullException(nameof(lobbyRepository));
    }


    public async Task<PuissanceGame> CreateAsync(Guid lobbyId, Guid player1Id, Guid player2Id,
        CancellationToken cancellationToken = default)
    {
        var game = new PuissanceGame(lobbyId, player1Id, player2Id);
        return await _repository.AddAsync(game, cancellationToken).ConfigureAwait(false);
    }

    public async Task<PuissanceGame?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default)
    {
        return await _repository.GetByIdAsync(gameId, cancellationToken).ConfigureAwait(false);
    }

    public async Task JoinAsync(Guid gameId, Guid playerId, CancellationToken cancellationToken = default)
    {
        var game = await EnsureGameExists(gameId, cancellationToken).ConfigureAwait(false);
        game.Join(playerId);
        await _repository.UpdateAsync(game, cancellationToken).ConfigureAwait(false);
    }

    public async Task LeaveAsync(Guid gameId, Guid playerId, CancellationToken cancellationToken = default)
    {
        var game = await EnsureGameExists(gameId, cancellationToken).ConfigureAwait(false);
        game.Leave(playerId);
        await _repository.UpdateAsync(game, cancellationToken).ConfigureAwait(false);
    }

    public async Task SetPrivacyAsync(Guid gameId, bool isPrivate, string? password,
        CancellationToken cancellationToken = default)
    {
        var game = await EnsureGameExists(gameId, cancellationToken).ConfigureAwait(false);
        game.SetPrivacy(isPrivate, password);
        await _repository.UpdateAsync(game, cancellationToken).ConfigureAwait(false);
    }

    public async Task PlayMoveAsync(Guid gameId, Guid playerId, int column,
        CancellationToken cancellationToken = default)
    {
        var game = await EnsureGameExists(gameId, cancellationToken).ConfigureAwait(false);
        game.PlayMove(playerId, column);
        await _repository.UpdateAsync(game, cancellationToken).ConfigureAwait(false);
    }

    public async Task<bool> CheckPasswordAsync(Guid gameId, string? password,
        CancellationToken cancellationToken = default)
    {
        var game = await EnsureGameExists(gameId, cancellationToken).ConfigureAwait(false);
        return game.CheckPassword(password);
    }

    public async Task SaveAsync(PuissanceGame game, CancellationToken cancellationToken = default)
    {
        if (game == null) throw new ArgumentNullException(nameof(game));
        await _repository.UpdateAsync(game, cancellationToken).ConfigureAwait(false);
    }

    private async Task<PuissanceGame> EnsureGameExists(Guid gameId, CancellationToken cancellationToken)
    {
        var game = await _repository.GetByIdAsync(gameId, cancellationToken).ConfigureAwait(false);
        if (game == null) throw new InvalidOperationException($"Game not found: {gameId}");
        return game;
    }
}