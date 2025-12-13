namespace GamePlatform.Application.Puissance;

public class PlayPuissanceGameCommande
{
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public int Column { get; set; }  // 0..6
}