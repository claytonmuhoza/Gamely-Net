namespace GamePlatform.Application.SpeedTyping;

public class TypingTextDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public int WordCount { get; set; }
    public string Language { get; set; } = string.Empty;
}