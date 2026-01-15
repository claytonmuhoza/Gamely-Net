using GamePlatform.Application.Lobbies;
using GamePlatform.Domain;
using GamePlatform.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Lobbies;

public sealed class LobbyRepository : ILobbyRepository
{
    private readonly AppDbContext _db;

    public LobbyRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task AddAsync(Lobby lobby, CancellationToken ct)
        => _db.Lobbies.AddAsync(lobby, ct).AsTask();

    public Task<List<Lobby>> ListWaitingAsync(CancellationToken ct)
        => _db.Lobbies
            .Include(l => l.Players)
            .Where(l => l.Status == LobbyStatus.Waiting)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync(ct);

    public Task SaveChangesAsync(CancellationToken ct)
        => _db.SaveChangesAsync(ct);
    public Task<Lobby?> GetByIdAsync(Guid lobbyId, CancellationToken ct)
        => _db.Lobbies
            .Include(l => l.Players)
            .FirstOrDefaultAsync(l => l.Id == lobbyId, ct);

    public Task RemoveAsync(Lobby lobby, CancellationToken ct)
    {
        _db.Lobbies.Remove(lobby);
        return Task.CompletedTask;
    }
    
    public Task<List<Lobby>> GetAllAsync(CancellationToken ct)
        => _db.Lobbies.OrderByDescending(l => l.CreatedAt).ToListAsync(ct);
    public Task<List<Lobby>> GetAllInGameAsync(CancellationToken ct)
    => _db.Lobbies.Where(l=>l.Status == LobbyStatus.InGame).ToListAsync(ct);


    
}