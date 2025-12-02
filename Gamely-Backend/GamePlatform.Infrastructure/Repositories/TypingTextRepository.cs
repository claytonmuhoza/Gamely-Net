using GamePlatform.Application.Interfaces.Repositories;
using GamePlatform.Infrastructure.Persistence;
using GamePlatforme.domain.Entities.SpeedTyping;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Repositories;

public class TypingTextRepository : ITypingTextRepository
{
    private readonly GamePlatformDbContext _context;
    private readonly Random _random = new();

    public TypingTextRepository(GamePlatformDbContext context)
    {
        _context = context;
    }

    public async Task<TypingText?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.TypingTexts
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<List<TypingText>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.TypingTexts.ToListAsync(cancellationToken);
    }

    public async Task<List<TypingText>> GetByDifficultyAsync(TextDifficulty difficulty, CancellationToken cancellationToken = default)
    {
        return await _context.TypingTexts
            .Where(t => t.Difficulty == difficulty)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<TypingText>> GetByLanguageAsync(string language, CancellationToken cancellationToken = default)
    {
        return await _context.TypingTexts
            .Where(t => t.Language == language)
            .ToListAsync(cancellationToken);
    }

    public async Task<TypingText?> GetRandomByDifficultyAsync(TextDifficulty difficulty, string language = "fr", CancellationToken cancellationToken = default)
    {
        var texts = await _context.TypingTexts
            .Where(t => t.Difficulty == difficulty && t.Language == language)
            .ToListAsync(cancellationToken);

        if (texts.Count == 0)
            return null;

        return texts[_random.Next(texts.Count)];
    }

    public async Task AddAsync(TypingText text, CancellationToken cancellationToken = default)
    {
        await _context.TypingTexts.AddAsync(text, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(TypingText text, CancellationToken cancellationToken = default)
    {
        _context.TypingTexts.Update(text);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var text = await _context.TypingTexts.FindAsync(new object[] { id }, cancellationToken);
        if (text != null)
        {
            _context.TypingTexts.Remove(text);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}