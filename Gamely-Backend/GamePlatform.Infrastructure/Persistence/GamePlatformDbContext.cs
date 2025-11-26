using GamePlatforme.domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Persistence;

public class GamePlatformDbContext: DbContext
{
    public GamePlatformDbContext(DbContextOptions<GamePlatformDbContext> options) : base(options)
    {
    }

    public DbSet<Player> Players => Set<Player>();
    public DbSet<Lobby> Lobbies => Set<Lobby>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Configs Fluent API si besoin
    }
}