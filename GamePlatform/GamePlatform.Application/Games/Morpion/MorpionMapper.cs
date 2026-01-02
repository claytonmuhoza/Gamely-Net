using GamePlatform.Contracts.Games.Morpion;
using GamePlatform.Domain.Games.Morpion;

namespace GamePlatform.Application.Games.Morpion;

public static class MorpionMapper
{
    public static MorpionGame ToDomain(Guid lobbyId, MorpionSnapshot s)
    {
        var board = s.Board.Select(v => (MorpionSymbol)v).ToArray();

        return new MorpionGame(
            lobbyId: lobbyId,
            playerX: s.PlayerX,
            playerO: s.PlayerO,
            currentPlayer: s.CurrentPlayer,
            board: board,
            winner: s.Winner,
            isDraw: s.IsDraw
        );
    }

    public static MorpionSnapshot ToSnapshot(MorpionGame game)
        => new()
        {
            PlayerX = game.PlayerX,
            PlayerO = game.PlayerO,
            CurrentPlayer = game.CurrentPlayer,
            Board = game.Board.Select(x => (int)x).ToArray(),
            Winner = game.Winner,
            IsDraw = game.IsDraw
        };

    public static MorpionStateDto ToDto(Guid lobbyId, MorpionSnapshot s, string pseudoX, string pseudoO)
    {
        var board = s.Board.Select(v => v switch
        {
            1 => "X",
            2 => "O",
            _ => ""
        }).ToList();

        var phase = (s.Winner is not null || s.IsDraw) ? "Finished" : "Running";

        return new MorpionStateDto(
            LobbyId: lobbyId,
            Phase: phase,
            Players: new()
            {
                new MorpionPlayerDto(s.PlayerX, pseudoX, "X"),
                new MorpionPlayerDto(s.PlayerO, pseudoO, "O")
            },
            CurrentPlayerId: s.CurrentPlayer,
            Board: board,
            WinnerClientId: s.Winner,
            IsDraw: s.IsDraw
        );
    }
}