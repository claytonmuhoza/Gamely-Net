using GamePlatform.Domain;
using GamePlatform.Domain.Scores;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Lobby> Lobbies => Set<Lobby>();
    public DbSet<LobbyPlayer> LobbyPlayers => Set<LobbyPlayer>();
    public DbSet<GameSession> GameSessions => Set<GameSession>();
    public DbSet<GameActionLog> GameActions => Set<GameActionLog>();
    public DbSet<ScoreEntry> Scores => Set<ScoreEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Lobby
        modelBuilder.Entity<Lobby>(b =>
        {
            b.HasKey(x => x.Id);

            b.Property(x => x.GameId).HasConversion<string>();
            b.Property(x => x.Status).HasConversion<string>();

            b.HasMany(x => x.Players)
                .WithOne()
                .HasForeignKey(p => p.LobbyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // LobbyPlayer : clé composite => pas de doublon (LobbyId, ClientId)
        modelBuilder.Entity<LobbyPlayer>(b =>
        {
            b.HasKey(p => new { p.LobbyId, p.ClientId });
            b.Property(p => p.Pseudo).IsRequired().HasMaxLength(20);
        });

        // GameSession
        modelBuilder.Entity<GameSession>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.GameId).HasConversion<string>();
            b.HasIndex(x => x.LobbyId).IsUnique();
        });

        // GameActionLog
        modelBuilder.Entity<GameActionLog>(b =>
        {
            b.HasKey(x => x.Id);

            b.Property(x => x.ActionType)
                .IsRequired()
                .HasMaxLength(100);

            b.Property(x => x.PayloadJson)
                .IsRequired();

            b.HasOne(x => x.GameSession)
                .WithMany() // ou WithMany(s => s.Actions) si vous avez une collection dans GameSession
                .HasForeignKey(x => x.GameSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => x.GameSessionId);
        });

        // Scores
        modelBuilder.Entity<ScoreEntry>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.GameId).HasConversion<string>();
            b.Property(x => x.Pseudo).IsRequired().HasMaxLength(20);
        });
    }
}
