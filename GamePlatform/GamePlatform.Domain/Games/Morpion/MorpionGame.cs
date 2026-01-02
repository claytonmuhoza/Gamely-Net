namespace GamePlatform.Domain.Games.Morpion;

public sealed class MorpionGame
{
    public Guid LobbyId { get; }
    public Guid PlayerX { get; }
    public Guid PlayerO { get; }

    public Guid CurrentPlayer { get; private set; }
    public MorpionSymbol[] Board { get; }

    public Guid? Winner { get; private set; }
    public bool IsDraw { get; private set; }
    public bool IsFinished => Winner is not null || IsDraw;

    public MorpionGame(
        Guid lobbyId,
        Guid playerX,
        Guid playerO,
        Guid currentPlayer,
        MorpionSymbol[]? board = null,
        Guid? winner = null,
        bool isDraw = false)
    {
        LobbyId = lobbyId;
        PlayerX = playerX;
        PlayerO = playerO;

        if (playerX == Guid.Empty || playerO == Guid.Empty) throw new ArgumentException("Players must be valid");
        if (playerX == playerO) throw new ArgumentException("Players must be different");
        if (currentPlayer != playerX && currentPlayer != playerO) throw new ArgumentException("Invalid current player");

        CurrentPlayer = currentPlayer;

        Board = board ?? new MorpionSymbol[9];
        if (Board.Length != 9) throw new ArgumentException("Board must have 9 cells");

        Winner = winner;
        IsDraw = isDraw;
    }

    public void PlayMove(Guid clientId, int index)
    {
        if (index < 0 || index > 8) throw new ArgumentException("Index must be 0..8");
        if (clientId != PlayerX && clientId != PlayerO) throw new InvalidOperationException("Player not in game");
        if (IsFinished) throw new InvalidOperationException("Game finished");
        if (clientId != CurrentPlayer) throw new InvalidOperationException("Not your turn");
        if (Board[index] != MorpionSymbol.None) throw new InvalidOperationException("Cell already taken");

        var symbol = (clientId == PlayerX) ? MorpionSymbol.X : MorpionSymbol.O;
        Board[index] = symbol;

        var winnerSymbol = GetWinnerSymbol(Board);
        if (winnerSymbol != MorpionSymbol.None)
        {
            Winner = (winnerSymbol == MorpionSymbol.X) ? PlayerX : PlayerO;
            return;
        }

        if (Board.All(c => c != MorpionSymbol.None))
        {
            IsDraw = true;
            return;
        }

        CurrentPlayer = (CurrentPlayer == PlayerX) ? PlayerO : PlayerX;
    }

    private static MorpionSymbol GetWinnerSymbol(MorpionSymbol[] b)
    {
        int[][] lines =
        {
            new[] {0,1,2}, new[] {3,4,5}, new[] {6,7,8},
            new[] {0,3,6}, new[] {1,4,7}, new[] {2,5,8},
            new[] {0,4,8}, new[] {2,4,6}
        };

        foreach (var line in lines)
        {
            var a = b[line[0]];
            if (a != MorpionSymbol.None && a == b[line[1]] && a == b[line[2]])
                return a;
        }
        return MorpionSymbol.None;
    }
}
