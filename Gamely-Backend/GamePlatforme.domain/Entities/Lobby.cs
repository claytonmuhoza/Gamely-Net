using GamePlatforme.domain.Enums;

namespace GamePlatforme.domain.Entities;

public class Lobby {
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Code { get; private set; } = string.Empty;

    public GameType GameType { get; private set; }

    public bool IsPrivate { get; private set; }
    public string? Password { get; private set; }

    public Guid HostPlayerId { get; private set; }
    public List<Guid> PlayerIds { get; private set; } = new();

    public bool HasStarted { get; private set; }

    protected Lobby() { }

    public Lobby(Guid hostPlayerId, GameType gameType, bool isPrivate, string? password, string code)
    {
        HostPlayerId = hostPlayerId;
        GameType = gameType;
        IsPrivate = isPrivate;
        Password = isPrivate ? password : null;
        Code = code;
        PlayerIds.Add(hostPlayerId);
    }

    public void AddPlayer(Guid playerId)
    {
        if (!PlayerIds.Contains(playerId))
            PlayerIds.Add(playerId);
    }

    public bool CheckPassword(string? password)
    {
        if (!IsPrivate) return true;
        return Password == password;
    }

    public void Start()
    {
        HasStarted = true;
    }
}