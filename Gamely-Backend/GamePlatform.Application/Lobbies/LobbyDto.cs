using GamePlatforme.domain.Entities;
using GamePlatforme.domain.Enums;

namespace GamePlatform.Application.Lobbies;

public class LobbyDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public GameType GameType { get; set; }
    public bool IsPrivate { get; set; }
    public bool HasStarted { get; set; }
    public Guid HostPlayerId { get; set; }
    public List<Guid> PlayerIds { get; set; } = new();
}