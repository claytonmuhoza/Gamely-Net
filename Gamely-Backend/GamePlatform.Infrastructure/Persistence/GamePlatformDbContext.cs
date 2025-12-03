using GamePlatforme.domain.Entities;
using GamePlatforme.domain.Entities.SpeedTyping;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Persistence;

public class GamePlatformDbContext: DbContext
{
    public GamePlatformDbContext(DbContextOptions<GamePlatformDbContext> options) : base(options)
    {
    }

    public DbSet<Player> Players => Set<Player>();
    public DbSet<Lobby> Lobbies => Set<Lobby>();
    public DbSet<MorpionGame> MorpionGames => Set<MorpionGame>();
    public DbSet<SpeedTypingGame> SpeedTypingGames => Set<SpeedTypingGame>();
    public DbSet<TypingText> TypingTexts => Set<TypingText>();
    public DbSet<PuissanceGame> PuissanceGames => Set<PuissanceGame>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Configs Fluent API si besoin
    }
}