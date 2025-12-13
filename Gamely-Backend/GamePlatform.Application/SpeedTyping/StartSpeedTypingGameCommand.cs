namespace GamePlatform.Application.SpeedTyping;

public class StartSpeedTypingGameCommand
{
    public Guid LobbyId { get; set; }
    public string TextDifficulty { get; set; } = "Medium";
    public int DurationSeconds { get; set; } = 60;
}
