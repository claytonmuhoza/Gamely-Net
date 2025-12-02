using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Infrastructure.Persistence;
using GamePlatforme.domain.Entities.SpeedTyping;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Repositories;

public class SpeedTypingGameRepository : ISpeedTypingGameRepository
{
    private readonly GamePlatformDbContext _context;

    public SpeedTypingGameRepository(GamePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<SpeedTypingGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.SpeedTypingGames
            .Include(g => g.Text)
            .Include(g => g.PlayerProgresses)
            .Include(g => g.Results)
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
    }

    public async Task<SpeedTypingGame?> GetByLobbyIdAsync(Guid lobbyId, CancellationToken cancellationToken = default)
    {
        return await _context.SpeedTypingGames
            .Include(g => g.Text)
            .Include(g => g.PlayerProgresses)
            .Include(g => g.Results)
            .FirstOrDefaultAsync(g => g.LobbyId == lobbyId, cancellationToken);
    }

    public async Task<List<SpeedTypingGame>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SpeedTypingGames
            .Include(g => g.Text)
            .Include(g => g.PlayerProgresses)
            .Include(g => g.Results)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<SpeedTypingGame>> GetByPlayerIdAsync(Guid playerId, CancellationToken cancellationToken = default)
    {
        return await _context.SpeedTypingGames
            .Include(g => g.Text)
            .Include(g => g.PlayerProgresses)
            .Include(g => g.Results)
            .Where(g => g.PlayerProgresses.Any(p => p.PlayerId == playerId))
            .ToListAsync(cancellationToken);
    }

    public async Task<List<SpeedTypingGame>> GetInProgressGamesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SpeedTypingGames
            .Include(g => g.Text)
            .Include(g => g.PlayerProgresses)
            .Include(g => g.Results)
            .Where(g => g.Status == SpeedTypingStatus.InProgress)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(SpeedTypingGame game, CancellationToken cancellationToken = default)
    {
        await _context.SpeedTypingGames.AddAsync(game, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(SpeedTypingGame game, CancellationToken cancellationToken = default)
    {
        _context.SpeedTypingGames.Update(game);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var game = await _context.SpeedTypingGames.FindAsync(new object[] { id }, cancellationToken);
        if (game != null)
        {
            _context.SpeedTypingGames.Remove(game);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.SpeedTypingGames.AnyAsync(g => g.Id == id, cancellationToken);
    }
}