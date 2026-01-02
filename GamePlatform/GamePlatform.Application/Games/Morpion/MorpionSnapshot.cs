namespace GamePlatform.Application.Games.Morpion;

public sealed class MorpionSnapshot
{
    public Guid PlayerX { get; set; }
    public Guid PlayerO { get; set; }
    public Guid CurrentPlayer { get; set; }

    // 0 none, 1 X, 2 O
    public int[] Board { get; set; } = new int[9];

    public Guid? Winner { get; set; }
    public bool IsDraw { get; set; }
}