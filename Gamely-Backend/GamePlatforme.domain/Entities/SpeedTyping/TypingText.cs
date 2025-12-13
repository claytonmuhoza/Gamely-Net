namespace GamePlatforme.domain.Entities.SpeedTyping;

public class TypingText
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Content { get; private set; }
    public TextDifficulty Difficulty { get; private set; }
    public int WordCount { get; private set; }
    public string Language { get; private set; }

    protected TypingText() 
    { 
        Content = string.Empty;
        Language = string.Empty;
    }

    public TypingText(string content, TextDifficulty difficulty, string language = "fr")
    {
        if (string.IsNullOrWhiteSpace(content))
            throw new ArgumentException("Content is required", nameof(content));
        
        if (string.IsNullOrWhiteSpace(language))
            throw new ArgumentException("Language is required", nameof(language));

        Content = content.Trim();
        Difficulty = difficulty;
        Language = language;
        WordCount = CalculateWordCount(content);
    }

    private static int CalculateWordCount(string text)
    {
        return text.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
    }
}