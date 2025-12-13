namespace GamePlatforme.domain.Entities;

public class PuissanceGame
{
    // taille du plateau pour Puissance-4 7*7
    private const int Rows = 7;
    private const int Cols = 7;
    private const char EmptyCell = '.';
    private const char Player1Symbol = 'R'; // ex: Red
    private const char Player2Symbol = 'Y'; // ex: Yellow

    protected PuissanceGame()
    {
    }

    public PuissanceGame(Guid lobbyId, Guid player1Id, Guid player2Id)
    {
        if (lobbyId == Guid.Empty) throw new ArgumentException("LobbyId is required", nameof(lobbyId));
        if (player1Id == Guid.Empty || player2Id == Guid.Empty)
            throw new ArgumentException("Player ids are required");

        if (player1Id == player2Id)
            throw new ArgumentException("Players must be different");

        LobbyId = lobbyId;
        Player1Id = player1Id;
        Player2Id = player2Id;
        CurrentPlayerId = player1Id;
        Board = new string(EmptyCell, Rows * Cols);
    }

    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid LobbyId { get; private set; }
    public string Board { get; private set; } = new(EmptyCell, Rows * Cols);
    public bool IsPrivate { get; private set; }
    public string? Password { get; private set; }

    public Guid Player1Id { get; private set; }
    public Guid Player2Id { get; private set; }

    public Guid CurrentPlayerId { get; private set; }

    public Guid? WinnerPlayerId { get; private set; }
    public bool IsFinished { get; private set; }
    public bool IsDraw { get; private set; }

    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    

    // column : 0..Cols-1
    public void PlayMove(Guid playerId, int column)
    {
        ValidateMove(playerId, column);

        var lastRow = ApplyMoveToBoard(column, playerId);
        var lastCol = column;

        var winner = CheckWinFrom(lastRow, lastCol);
        if (winner != null)
        {
            Finish(winner);
            return;
        }

        if (CheckDraw())
        {
            Finish(null, true);
            return;
        }

        SwitchTurn();
    }

    public bool CheckPassword(string? password)
    {
        return !IsPrivate || Password == password;
    }

    // --- Méthodes privées / utilitaires ---
    private void ValidateMove(Guid playerId, int column)
    {
        if (IsFinished) throw new InvalidOperationException("Game is finished");
        if (playerId != CurrentPlayerId) throw new InvalidOperationException("Not this player's turn");
        if (column < 0 || column >= Cols) throw new ArgumentOutOfRangeException(nameof(column));
        // vérifier si la colonne est pleine (case du haut non vide)
        if (Board[column] != EmptyCell) throw new InvalidOperationException("Column is full");
        if (playerId != Player1Id && playerId != Player2Id) throw new InvalidOperationException("Unknown player");
    }

    // place le jeton en bas de la colonne et retourne la ligne où il tombe
    private int ApplyMoveToBoard(int column, Guid playerId)
    {
        var symbol = playerId == Player1Id ? Player1Symbol : Player2Symbol;
        var chars = Board.ToCharArray();

        for (var r = Rows - 1; r >= 0; r--)
        {
            var idx = r * Cols + column;
            if (chars[idx] == EmptyCell)
            {
                chars[idx] = symbol;
                Board = new string(chars);
                return r;
            }
        }

        throw new InvalidOperationException("Column is full");
    }

    // recherche 4 consécutifs autour de la dernière position
    private Guid? CheckWinFrom(int lastRow, int lastCol)
    {
        var matrix = ToMatrix();
        var symbol = matrix[lastRow, lastCol];
        if (symbol == EmptyCell) return null;

        // directions à tester : horizontale, verticale, diag1, diag2
        (int dr, int dc)[] dirs = new[]
        {
            (0, 1), (1, 0), (1, 1), (1, -1)
        };

        foreach (var (dr, dc) in dirs)
        {
            var count = 1 + CountDirection(matrix, lastRow, lastCol, dr, dc, symbol)
                          + CountDirection(matrix, lastRow, lastCol, -dr, -dc, symbol);
            if (count >= 4) return SymbolToPlayerId(symbol);
        }

        return null;
    }

    private int CountDirection(char[,] matrix, int startR, int startC, int dr, int dc, char symbol)
    {
        var r = startR + dr;
        var c = startC + dc;
        var cnt = 0;
        while (r >= 0 && r < Rows && c >= 0 && c < Cols && matrix[r, c] == symbol)
        {
            cnt++;
            r += dr;
            c += dc;
        }

        return cnt;
    }

    private bool CheckDraw()
    {
        return !Board.Contains(EmptyCell);
    }

    private void SwitchTurn()
    {
        if (IsFinished) return;
        if (CurrentPlayerId == Player1Id) CurrentPlayerId = Player2Id;
        else CurrentPlayerId = Player1Id;
    }

    private void Finish(Guid? winnerId, bool isDraw = false)
    {
        IsFinished = true;
        IsDraw = isDraw;
        WinnerPlayerId = winnerId;
    }

    // --- Helpers de transformation de Board ---
    private char[,] ToMatrix()
    {
        var matrix = new char[Rows, Cols];
        for (var r = 0; r < Rows; r++)
        for (var c = 0; c < Cols; c++)
            matrix[r, c] = Board[r * Cols + c];
        return matrix;
    }

    private void FromMatrix(char[,] matrix)
    {
        var chars = new char[Rows * Cols];
        for (var r = 0; r < Rows; r++)
        for (var c = 0; c < Cols; c++)
            chars[r * Cols + c] = matrix[r, c];
        Board = new string(chars);
    }

    private Guid? SymbolToPlayerId(char symbol)
    {
        if (symbol == Player1Symbol) return Player1Id;
        if (symbol == Player2Symbol) return Player2Id;
        return null;
    }
}