namespace GamePlatforme.domain.Entities;

public class Player
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Pseudo { get; private set; }

    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    protected Player() { } 

    public Player(string pseudo)
    {
        Pseudo = pseudo.Trim();
    }
}