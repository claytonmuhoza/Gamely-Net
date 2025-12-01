namespace GamePlatform.Application.Morpion;

public class MorpionGameDto
{
    public Guid Id { get; set; }
    public Guid LobbyId { get; set; }
    public string Board { get; set; } = "........."; // 9 chars
    public Guid PlayerXId { get; set; }
    public Guid PlayerOId { get; set; }
    public Guid CurrentPlayerId { get; set; }
    public Guid? WinnerPlayerId { get; set; }
    public bool IsFinished { get; set; }
    public bool IsDraw { get; set; }
}