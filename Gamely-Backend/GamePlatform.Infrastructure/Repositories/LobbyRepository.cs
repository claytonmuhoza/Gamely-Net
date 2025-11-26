using GamePlatform.Application.Lobbies;
using GamePlatform.Infrastructure.Persistence;
using GamePlatforme.domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Repositories;

public class LobbyRepository : ILobbyRepository {
    private readonly GamePlatformDbContext _context;

    public LobbyRepository(GamePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<Lobby> AddAsync(Lobby lobby, CancellationToken cancellationToken = default)
    {
        _context.Lobbies.Add(lobby);
        await _context.SaveChangesAsync(cancellationToken);
        return lobby;
    }

    public Task<Lobby?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.Lobbies.FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
    }

    public Task<Lobby?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        return _context.Lobbies.FirstOrDefaultAsync(l => l.Code == code, cancellationToken);
    }

    public async Task<IEnumerable<Lobby>> GetOpenLobbiesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Lobbies
            .Where(l => !l.HasStarted)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(Lobby lobby, CancellationToken cancellationToken = default)
    {
        _context.Lobbies.Update(lobby);
        await _context.SaveChangesAsync(cancellationToken);
    }
}