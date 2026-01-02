namespace GamePlatform.Application.Games.Puissance4;

public sealed class Puissance4Snapshot
{
    public Guid PlayerRed { get; set; }
    public Guid PlayerYellow { get; set; }
    public Guid CurrentPlayer { get; set; }

    // 7x6, stocké en int : 0 none, 1 red, 2 yellow
    public int[][] Grid { get; set; } = Enumerable.Range(0, 7).Select(_ => new int[6]).ToArray();

    public Guid? Winner { get; set; }
    public bool IsDraw { get; set; }
}