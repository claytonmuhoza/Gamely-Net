namespace GamePlatform.Core.Models;


public class Lobby
{
    public Guid Id { get; set; }
    public string GameType { get; set; } = default!;
    public string Link { get; set; } = default!;
    public string? Password { get; set; }
    public Guid HostId { get; set; }
    public List<Player> Players { get; set; } = new();
}