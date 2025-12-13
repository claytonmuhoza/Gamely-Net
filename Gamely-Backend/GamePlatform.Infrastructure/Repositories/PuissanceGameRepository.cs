using System.Collections.Concurrent;
using GamePlatforme.domain.Entities;
using GamePlatform.Application.Puissance;
using GamePlatform.Infrastructure.Persistence;

namespace GamePlatform.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

public class PuissanceGameRepository : IPuissanceGameRepository
{
    private readonly GamePlatformDbContext _context;
    
    public PuissanceGameRepository(GamePlatformDbContext context)
    {
        _context = context;
    }
    
    public async Task<PuissanceGame> AddAsync(PuissanceGame game, CancellationToken cancellationToken = default)
    {
        if (game == null) throw new ArgumentNullException(nameof(game));
        await _context.PuissanceGames.AddAsync(game, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return game;
    }

    public Task<PuissanceGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.PuissanceGames.FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
    }

    public Task UpdateAsync(PuissanceGame game, CancellationToken cancellationToken = default)
    {   
        _context.PuissanceGames.Update(game);
        return _context.SaveChangesAsync(cancellationToken);
    }
}