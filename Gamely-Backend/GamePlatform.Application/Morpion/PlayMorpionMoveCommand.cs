namespace GamePlatform.Application.Morpion;

public class PlayMorpionMoveCommand
{
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public int Row { get; set; }  // 0..2
    public int Col { get; set; }  // 0..2
}