namespace GamePlatform.Domain.Games.Puissance4;

public sealed class Puissance4Game
{
    public const int Columns = 7;
    public const int Rows = 6;

    public Guid LobbyId { get; }
    public Guid PlayerRed { get; }
    public Guid PlayerYellow { get; }

    public Guid CurrentPlayer { get; private set; }
    public Puissance4Disc[,] Grid { get; } = new Puissance4Disc[Columns, Rows];

    public Guid? Winner { get; private set; }
    public bool IsDraw { get; private set; }
    public bool IsFinished => Winner is not null || IsDraw;

    public Puissance4Game(
        Guid lobbyId,
        Guid playerRed,
        Guid playerYellow,
        Guid currentPlayer,
        Puissance4Disc[,]? grid = null,
        Guid? winner = null,
        bool isDraw = false)
    {
        LobbyId = lobbyId;
        PlayerRed = playerRed;
        PlayerYellow = playerYellow;

        if (playerRed == Guid.Empty || playerYellow == Guid.Empty) throw new ArgumentException("Players must be valid");
        if (playerRed == playerYellow) throw new ArgumentException("Players must be different");
        if (currentPlayer != playerRed && currentPlayer != playerYellow) throw new ArgumentException("Invalid current player");

        CurrentPlayer = currentPlayer;

        if (grid is not null)
        {
            if (grid.GetLength(0) != Columns || grid.GetLength(1) != Rows)
                throw new ArgumentException("Invalid grid size");
            for (int c = 0; c < Columns; c++)
                for (int r = 0; r < Rows; r++)
                    Grid[c, r] = grid[c, r];
        }

        Winner = winner;
        IsDraw = isDraw;
    }

    // Retourne la ligne où le disque est tombé
    public int Drop(Guid clientId, int column)
    {
        if (column < 0 || column >= Columns) throw new ArgumentException("Column must be 0..6");
        if (clientId != PlayerRed && clientId != PlayerYellow) throw new InvalidOperationException("Player not in game");
        if (IsFinished) throw new InvalidOperationException("Game finished");
        if (clientId != CurrentPlayer) throw new InvalidOperationException("Not your turn");

        // trouver la première case libre (de bas en haut)
        var disc = clientId == PlayerRed ? Puissance4Disc.Red : Puissance4Disc.Yellow;

        for (int row = 0; row < Rows; row++)
        {
            if (Grid[column, row] == Puissance4Disc.None)
            {
                Grid[column, row] = disc;

                if (IsWinningMove(column, row, disc))
                {
                    Winner = clientId;
                    return row;
                }

                if (IsBoardFull())
                {
                    IsDraw = true;
                    return row;
                }

                CurrentPlayer = (CurrentPlayer == PlayerRed) ? PlayerYellow : PlayerRed;
                return row;
            }
        }

        throw new InvalidOperationException("Column is full");
    }

    private bool IsBoardFull()
    {
        for (int c = 0; c < Columns; c++)
            if (Grid[c, Rows - 1] == Puissance4Disc.None) return false;
        return true;
    }

    private bool IsWinningMove(int c, int r, Puissance4Disc d)
    {
        return CountDir(c, r, 1, 0, d) + CountDir(c, r, -1, 0, d) - 1 >= 4 || // horizontal
               CountDir(c, r, 0, 1, d) + CountDir(c, r, 0, -1, d) - 1 >= 4 || // vertical
               CountDir(c, r, 1, 1, d) + CountDir(c, r, -1, -1, d) - 1 >= 4 || // diag /
               CountDir(c, r, 1, -1, d) + CountDir(c, r, -1, 1, d) - 1 >= 4;   // diag \
    }

    private int CountDir(int c, int r, int dc, int dr, Puissance4Disc d)
    {
        int count = 0;
        int cc = c, rr = r;
        while (cc >= 0 && cc < Columns && rr >= 0 && rr < Rows && Grid[cc, rr] == d)
        {
            count++;
            cc += dc;
            rr += dr;
        }
        return count;
    }
}
