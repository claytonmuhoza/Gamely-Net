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
    public DbSet<PlayerProgress> PlayerProgresses { get; set; } = null!;
    public DbSet<PlayerResult> PlayerResults { get; set; } = null!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<SpeedTypingGame>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Status)
                .HasConversion<string>();
            
            // Relation avec TypingText
            entity.HasOne(e => e.Text)
                .WithMany()
                .IsRequired();
            
            // ✅ CRITIQUE : Relations avec PlayerProgresses
            entity.HasMany(e => e.PlayerProgresses)
                .WithOne()
                .HasForeignKey(p => p.SpeedTypingGameId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // ✅ CRITIQUE : Relations avec Results
            entity.HasMany(e => e.Results)
                .WithOne()
                .HasForeignKey(r => r.SpeedTypingGameId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PlayerProgress>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CurrentTypedText).HasMaxLength(10000);
        });

        modelBuilder.Entity<PlayerResult>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<TypingText>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Difficulty).HasConversion<string>();
            entity.Property(e => e.Content).HasMaxLength(5000);
        });
    }
}