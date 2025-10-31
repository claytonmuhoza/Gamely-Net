namespace GamePlatform.Core.Models;

public class Player
{
    public Guid Id { get; set; }
    public required string Pseudo { get; set; }
    public string? ConnectionId { get; set; }
}