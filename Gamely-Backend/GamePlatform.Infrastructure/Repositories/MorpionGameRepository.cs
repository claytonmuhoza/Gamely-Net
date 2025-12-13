using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Application.Morpion;
using GamePlatform.Infrastructure.Persistence;
using GamePlatforme.domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Repositories;

public class MorpionGameRepository : IMorpionGameRepository
{
    private readonly GamePlatformDbContext _context;

    public MorpionGameRepository(GamePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<MorpionGame> AddAsync(MorpionGame game, CancellationToken cancellationToken = default)
    {
        _context.MorpionGames.Add(game);
        await _context.SaveChangesAsync(cancellationToken);
        return game;
    }

    public Task<MorpionGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.MorpionGames.FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
    }

    public async Task UpdateAsync(MorpionGame game, CancellationToken cancellationToken = default)
    {
        _context.MorpionGames.Update(game);
        await _context.SaveChangesAsync(cancellationToken);
    }
}