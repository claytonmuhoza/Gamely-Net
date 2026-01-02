using GamePlatform.Application.Games;
using GamePlatform.Domain;
using GamePlatform.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Games;

public sealed class GameSessionRepository : IGameSessionRepository
{
    private readonly AppDbContext _db;

    public GameSessionRepository(AppDbContext db) => _db = db;

    public Task AddAsync(GameSession session, CancellationToken ct)
        => _db.GameSessions.AddAsync(session, ct).AsTask();

    public Task<GameSession?> GetByLobbyIdAsync(Guid lobbyId, CancellationToken ct)
        => _db.GameSessions.FirstOrDefaultAsync(s => s.LobbyId == lobbyId, ct);

    public Task SaveChangesAsync(CancellationToken ct)
        => _db.SaveChangesAsync(ct);
}