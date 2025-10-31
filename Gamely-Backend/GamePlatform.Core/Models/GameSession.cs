namespace GamePlatform.Core.Models;

public class GameSession
{
    public Guid Id { get; set; }
    public Guid LobbyId { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset? EndTime { get; set; }
}