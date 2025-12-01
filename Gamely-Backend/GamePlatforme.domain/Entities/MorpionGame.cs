namespace GamePlatforme.domain.Entities;

public class MorpionGame
{
    public Guid Id { get; private set; } = Guid.NewGuid();

    public Guid LobbyId { get; private set; }

    public string Board { get; private set; } = "........."; // 9 chars '.', 'X', 'O'

    public Guid PlayerXId { get; private set; }
    public Guid PlayerOId { get; private set; }

    public Guid CurrentPlayerId { get; private set; }

    public Guid? WinnerPlayerId { get; private set; }
    public bool IsFinished { get; private set; }
    public bool IsDraw { get; private set; }

    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    protected MorpionGame() { }

    public MorpionGame(Guid lobbyId, Guid playerXId, Guid playerOId)
    {
        if (lobbyId == Guid.Empty) throw new ArgumentException("LobbyId is required", nameof(lobbyId));
        if (playerXId == Guid.Empty || playerOId == Guid.Empty)
            throw new ArgumentException("Player ids are required");

        if (playerXId == playerOId)
            throw new ArgumentException("Players must be different");

        LobbyId = lobbyId;
        PlayerXId = playerXId;
        PlayerOId = playerOId;
        CurrentPlayerId = playerXId;
        Board = ".........";
    }

    public void PlayMove(Guid playerId, int row, int col)
    {
        if (IsFinished)
            throw new InvalidOperationException("Game is already finished");

        if (playerId != PlayerXId && playerId != PlayerOId)
            throw new InvalidOperationException("Player not part of this game");

        if (playerId != CurrentPlayerId)
            throw new InvalidOperationException("Not this player's turn");

        if (row is < 0 or > 2 || col is < 0 or > 2)
            throw new ArgumentOutOfRangeException(nameof(row), "Row/Col must be between 0 and 2");

        var index = row * 3 + col;
        var boardChars = Board.ToCharArray();

        if (boardChars[index] != '.')
            throw new InvalidOperationException("Cell already taken");

        char mark = playerId == PlayerXId ? 'X' : 'O';
        boardChars[index] = mark;
        Board = new string(boardChars);

        bool isWin = CheckWinner(Board, mark);
        bool isDraw = !isWin && !Board.Contains('.');

        if (isWin)
        {
            IsFinished = true;
            WinnerPlayerId = playerId;
            IsDraw = false;
        }
        else if (isDraw)
        {
            IsFinished = true;
            WinnerPlayerId = null;
            IsDraw = true;
        }
        else
        {
            CurrentPlayerId = playerId == PlayerXId ? PlayerOId : PlayerXId;
        }
    }

    private static bool CheckWinner(string board, char mark)
    {
        int[][] lines =
        [
            // lignes
            [0,1,2], [3,4,5], [6,7,8],
            // colonnes
            [0,3,6], [1,4,7], [2,5,8],
            // diagonales
            [0,4,8], [2,4,6]
        ];

        foreach (var line in lines)
        {
            if (board[line[0]] == mark && board[line[1]] == mark && board[line[2]] == mark)
                return true;
        }

        return false;
    }
}
