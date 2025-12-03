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

    public async Task<SpeedTypingGame> AddAsync(SpeedTypingGame game, CancellationToken cancellationToken = default)
    {
        _context.SpeedTypingGames.Add(game);
        await _context.SaveChangesAsync(cancellationToken);
        return game;
    }

    public async Task<SpeedTypingGame?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.SpeedTypingGames
            .Include(g => g.Text)
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
    }

    public async Task<SpeedTypingGame?> GetByLobbyIdAsync(Guid lobbyId, CancellationToken cancellationToken = default)
    {
        return await _context.SpeedTypingGames
            .Include(g => g.Text)
            .FirstOrDefaultAsync(g => g.LobbyId == lobbyId, cancellationToken);
    }

    public async Task UpdateAsync(SpeedTypingGame game, CancellationToken cancellationToken = default)
    {
        _context.SpeedTypingGames.Update(game);
        await _context.SaveChangesAsync(cancellationToken);
    }
}