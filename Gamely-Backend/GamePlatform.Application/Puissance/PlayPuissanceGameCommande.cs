namespace GamePlatform.Application.Puissance;

public class PlayPuissanceGameCommande
{
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public int Row { get; set; }  
    public int Col { get; set; }  
}