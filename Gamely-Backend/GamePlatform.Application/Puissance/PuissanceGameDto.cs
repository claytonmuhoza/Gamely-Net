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

    // Indique si la partie est privée (le mot de passe n'est pas exposé ici)
    public bool IsPrivate { get; init; }
    public bool HasPassword { get; init; }

    // Représentation ligne par ligne du plateau :
    // 0 = case vide, 1 = pion joueur1, 2 = pion joueur2 (convention)
    public int[][] Board { get; init; } = Array.Empty<int[]>();

    // Dimensions pratiques (peuvent être redondantes par rapport à Board)
    public int Rows => Board?.Length ?? 0;
    public int Columns => (Board != null && Board.Length > 0) ? Board[0].Length : 0;

    // Statut lisible (ex: "Waiting", "InProgress", "Finished")
    public string Status { get; init; } = string.Empty;

    // Horodatage optionnel
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
        int[][] board,
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
        IsPrivate = isPrivate;
        HasPassword = hasPassword;
        Board = board ?? Array.Empty<int[]>();
        Status = status ?? string.Empty;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }
}