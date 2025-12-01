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
    public int MinPlayers { get; private set; }
    public int MaxPlayers { get; private set; }
    protected Lobby() { }

    public Lobby(Guid hostPlayerId, GameType gameType, bool isPrivate, string? password, string code, int minPlayers,
        int maxPlayers)
    {
        if (hostPlayerId == Guid.Empty)
            throw new ArgumentException("HostPlayerId is required", nameof(hostPlayerId));
        if (minPlayers <= 0 || maxPlayers <= 0 || minPlayers > maxPlayers)
            throw new ArgumentException("Invalid players limits");

        HostPlayerId = hostPlayerId;
        GameType = gameType;
        IsPrivate = isPrivate;
        Password = isPrivate ? password ?? throw new ArgumentException("Password required for private lobby", nameof(password)) : null;
        Code = code ?? throw new ArgumentNullException(nameof(code));
        MinPlayers = minPlayers;
        MaxPlayers = maxPlayers;
    }

    public void AddPlayer(Guid playerId)
    {
        if (playerId == Guid.Empty)
            throw new ArgumentException("PlayerId is required", nameof(playerId));

        if (PlayerIds.Contains(playerId))
            throw new InvalidOperationException("Player already in lobby");

        if (PlayerIds.Count >= MaxPlayers)
            throw new InvalidOperationException("Lobby is full");
        
        PlayerIds.Add(playerId);

    }

    public bool CheckPassword(string? password)
    {
        if (!IsPrivate) return true;
        return Password == password;
    }

    public void Start()
    {
        if (HasStarted)
            throw new InvalidOperationException("Game already started");

        if (PlayerIds.Count < MinPlayers)
            throw new InvalidOperationException("Not enough players to start the game");
        HasStarted = true;
    }
}