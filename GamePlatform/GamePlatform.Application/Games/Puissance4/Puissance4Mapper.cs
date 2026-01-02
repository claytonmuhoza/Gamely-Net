using GamePlatform.Contracts.Games.Puissance4;
using GamePlatform.Domain.Games.Puissance4;

namespace GamePlatform.Application.Games.Puissance4;

public static class Puissance4Mapper
{
    public static Puissance4Game ToDomain(Guid lobbyId, Puissance4Snapshot s)
    {
        var grid = new Puissance4Disc[Puissance4Game.Columns, Puissance4Game.Rows];
        for (int c = 0; c < Puissance4Game.Columns; c++)
            for (int r = 0; r < Puissance4Game.Rows; r++)
                grid[c, r] = (Puissance4Disc)s.Grid[c][r];

        return new Puissance4Game(
            lobbyId: lobbyId,
            playerRed: s.PlayerRed,
            playerYellow: s.PlayerYellow,
            currentPlayer: s.CurrentPlayer,
            grid: grid,
            winner: s.Winner,
            isDraw: s.IsDraw
        );
    }

    public static Puissance4Snapshot ToSnapshot(Puissance4Game game)
    {
        var s = new Puissance4Snapshot
        {
            PlayerRed = game.PlayerRed,
            PlayerYellow = game.PlayerYellow,
            CurrentPlayer = game.CurrentPlayer,
            Winner = game.Winner,
            IsDraw = game.IsDraw
        };

        for (int c = 0; c < Puissance4Game.Columns; c++)
            for (int r = 0; r < Puissance4Game.Rows; r++)
                s.Grid[c][r] = (int)game.Grid[c, r];

        return s;
    }

    public static Puissance4StateDto ToDto(Guid lobbyId, Puissance4Snapshot s, string pseudoR, string pseudoY)
    {
        var grid = new List<List<string>>(7);
        for (int c = 0; c < 7; c++)
        {
            var col = new List<string>(6);
            for (int r = 0; r < 6; r++)
            {
                col.Add(s.Grid[c][r] switch
                {
                    1 => "R",
                    2 => "Y",
                    _ => ""
                });
            }
            grid.Add(col);
        }

        var phase = (s.Winner is not null || s.IsDraw) ? "Finished" : "Running";

        return new Puissance4StateDto(
            LobbyId: lobbyId,
            Phase: phase,
            Players: new()
            {
                new Puissance4PlayerDto(s.PlayerRed, pseudoR, "R"),
                new Puissance4PlayerDto(s.PlayerYellow, pseudoY, "Y")
            },
            CurrentPlayerId: s.CurrentPlayer,
            Grid: grid,
            WinnerClientId: s.Winner,
            IsDraw: s.IsDraw
        );
    }
}
