namespace GamePlatform.Application.SpeedTyping;

public class SpeedTypingGameDto
{
    public Guid Id { get; set; }
    public Guid LobbyId { get; set; }
    public TypingTextDto Text { get; set; } = null!;
    public string Status { get; set; } = string.Empty;
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public int DurationSeconds { get; set; }
    public List<PlayerProgressDto> PlayerProgresses { get; set; } = new();
    public List<PlayerResultDto> Results { get; set; } = new();
}