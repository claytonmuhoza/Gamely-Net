namespace GamePlatform.Application.Lobbies;

public class JoinLobbyCommand
{
    public Guid LobbyId { get; set; }
    public Guid PlayerId { get; set; }
    public string? Password { get; set; }
}