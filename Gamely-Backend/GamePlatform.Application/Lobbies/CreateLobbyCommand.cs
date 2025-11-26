using GamePlatforme.domain.Entities;
using GamePlatforme.domain.Enums;

namespace GamePlatform.Application.Lobbies;

public class CreateLobbyCommand
{
    public Guid HostPlayerId { get; set; }
    public GameType GameType { get; set; }
    public bool IsPrivate { get; set; }
    public string? Password { get; set; }
}