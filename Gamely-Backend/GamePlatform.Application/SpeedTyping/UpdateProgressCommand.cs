namespace GamePlatform.Application.SpeedTyping;

public class UpdateProgressCommand
{
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public string TypedText { get; set; } = string.Empty;
}