using GamePlatform.Application.Players;
using GamePlatform.Infrastructure.Persistence;
using GamePlatforme.domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Repositories;

public class PlayerRepository : IPlayerRepository
{
    private readonly GamePlatformDbContext _context;

    public PlayerRepository(GamePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<Player> AddAsync(Player player, CancellationToken cancellationToken = default)
    {
        _context.Players.Add(player);
        await _context.SaveChangesAsync(cancellationToken);
        return player;
    }

    public Task<Player?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.Players.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }
}