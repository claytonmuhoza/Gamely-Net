// csharp
using System;

namespace GamePlatform.Application.Puissance;

public class PuissanceGameDto
{
    public Guid Id { get; init; }
    public Guid LobbyId { get; init; }
    public Guid Player1Id { get; init; }
    public Guid? Player2Id { get; init; }
    public Guid? CurrentPlayerId { get; init; }
    public Guid? WinnerId { get; init; }
    

    // Représentation plate (string) du plateau : '.' = vide, 'R'/'Y' ou 'r'/'y'
    // Longueur attendue pour 7x7 = 49
    public string Board { get; init; } = new('.', 7 * 7);

    // Tentative de déduction des dimensions : si la longueur est un carré parfait on l'utilise,
    // sinon on retourne la taille par défaut 7x7.
    public int Rows
    {
        get
        {
            if (string.IsNullOrEmpty(Board)) return 0;
            var len = Board.Length;
            var root = (int)Math.Sqrt(len);
            return root * root == len ? root : 7;
        }
    }

    public int Columns
    {
        get
        {
            var rows = Rows;
            return rows > 0 ? Board.Length / rows : 0;
        }
    }

    public string Status { get; init; } = string.Empty;
    public DateTime? CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }

    public PuissanceGameDto() { }

    public PuissanceGameDto(
        Guid id,
        Guid lobbyId,
        Guid player1Id,
        Guid? player2Id,
        Guid? currentPlayerId,
        Guid? winnerId,
        bool isPrivate,
        bool hasPassword,
        string board,
        string status = "",
        DateTime? createdAt = null,
        DateTime? updatedAt = null)
    {
        Id = id;
        LobbyId = lobbyId;
        Player1Id = player1Id;
        Player2Id = player2Id;
        CurrentPlayerId = currentPlayerId;
        WinnerId = winnerId;
        Board = board ?? new('.', 7*7);
        Status = status ?? string.Empty;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }
}