using GamePlatform.Domain;

namespace GamePlatform.Domain;

public class GameSession
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LobbyId { get; set; }
    public Lobby Lobby { get; set; } = default!;

    public GameId GameId { get; set; }
    public GamePhase Phase { get; set; } = GamePhase.Running;

    public string StateJson { get; set; } = "{}";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? EndedAt { get; set; }
}


public class GameActionLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid GameSessionId { get; set; }
    public GameSession GameSession { get; set; } = default!;

    public string ActionType { get; set; } = default!;
    public string PayloadJson { get; set; } = "{}";
    public Guid? ActorClientId { get; set; }
    public DateTimeOffset At { get; set; } = DateTimeOffset.UtcNow;
}