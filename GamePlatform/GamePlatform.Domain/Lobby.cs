namespace GamePlatform.Domain;

public class Lobby
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public GameId GameId { get; set; }
    public LobbyStatus Status { get; set; } = LobbyStatus.Waiting;

    public bool IsPrivate { get; set; }
    public string? PasswordHash { get; set; }

    public Guid HostClientId { get; set; } = default!;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public List<LobbyPlayer> Players { get; set; } = new();
}
public class LobbyPlayer
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LobbyId { get; set; }
    public Lobby Lobby { get; set; } = default!;

    public Guid ClientId { get; set; } = default!;
    public string Pseudo { get; set; } = default!;
    public DateTimeOffset JoinedAt { get; set; } = DateTimeOffset.UtcNow;
}
