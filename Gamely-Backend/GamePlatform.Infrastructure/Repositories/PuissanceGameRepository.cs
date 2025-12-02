using System.Collections.Concurrent;
using GamePlatforme.domain.Entities;
using GamePlatform.Application.Puissance;

namespace GamePlatform.Infrastructure.Repositories;

public class PuissanceGameRepository : IPuissanceGameRepository
{
    private readonly ConcurrentDictionary<Guid, PuissanceGame> _store = new();

    public Task<PuissanceGame> AddAsync(PuissanceGame game, CancellationToken cancellationToken = default)
    {
        if (game == null) throw new ArgumentNullException(nameof(game));
        cancellationToken.ThrowIfCancellationRequested();
        _store[game.Id] = game;
        return Task.FromResult(game);
    }

    public Task<PuissanceGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _store.TryGetValue(id, out var game);
        return Task.FromResult(game);
    }

    public Task UpdateAsync(PuissanceGame game, CancellationToken cancellationToken = default)
    {
        if (game == null) throw new ArgumentNullException(nameof(game));
        cancellationToken.ThrowIfCancellationRequested();
        _store[game.Id] = game;
        return Task.CompletedTask;
    }
}