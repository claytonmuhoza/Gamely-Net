using System.Text.Json;
using GamePlatform.Application.Games.Morpion;
using GamePlatform.Application.Lobbies;
using GamePlatform.Domain;
using GamePlatform.Contracts.Games.Morpion;
using GamePlatform.Contracts.Games.Puissance4;
using GamePlatform.Contracts.Games.SpeedTyping;
using GamePlatform.Application.Games.Puissance4;
using GamePlatform.Application.Games.SpeedTyping;

namespace GamePlatform.Application.Games;

public sealed class GetCurrentGameStateHandler
{
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    private readonly IGameSessionRepository _sessions;
    private readonly ILobbyRepository _lobbies;

    public GetCurrentGameStateHandler(IGameSessionRepository sessions, ILobbyRepository lobbies)
    {
        _sessions = sessions;
        _lobbies = lobbies;
    }

    public async Task<object> Handle(Guid lobbyId, CancellationToken ct)
    {
        var session = await _sessions.GetByLobbyIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Game session not found");

        var lobby = await _lobbies.GetByIdAsync(lobbyId, ct)
            ?? throw new KeyNotFoundException("Lobby not found");

        return session.GameId switch
        {
            GameId.Morpion => BuildMorpionDto(session, lobby),
            GameId.Puissance4 => BuildPuissance4Dto(session, lobby),
            GameId.SpeedTyping => BuildSpeedTypingDto(session, lobby),
            _ => throw new InvalidOperationException($"Unsupported game: {session.GameId}")
        };
    }

    // =========================
    // Morpion
    // =========================
    private static MorpionStateDto BuildMorpionDto(GameSession session, Lobby lobby)
    {
        var snapshot = JsonSerializer.Deserialize<MorpionSnapshot>(session.StateJson, JsonOpts)
            ?? throw new InvalidOperationException("Invalid morpion state");

        var px = lobby.Players.First(p => p.ClientId == snapshot.PlayerX);
        var po = lobby.Players.First(p => p.ClientId == snapshot.PlayerO);

        var players = new List<MorpionPlayerDto>
        {
            new(snapshot.PlayerX, px.Pseudo, "X"),
            new(snapshot.PlayerO, po.Pseudo, "O")
        };

        var phase = session.Phase == GamePhase.Running ? "Running" : "Finished";

        var board = snapshot.Board.Select(v => v switch
        {
            0 => "",
            1 => "X",
            2 => "O",
            _ => ""
        }).ToList();

        return new MorpionStateDto(
            LobbyId: lobby.Id,
            Phase: phase,
            Players: players,
            CurrentPlayerId: snapshot.CurrentPlayer,
            Board: board,
            WinnerClientId: snapshot.Winner,
            IsDraw: snapshot.IsDraw
        );
    }

    // =========================
    // Puissance 4
    // =========================
    private static Puissance4StateDto BuildPuissance4Dto(GameSession session, Lobby lobby)
    {
        var snapshot = JsonSerializer.Deserialize<Puissance4Snapshot>(session.StateJson, JsonOpts)
            ?? throw new InvalidOperationException("Invalid puissance4 state");

        var pr = lobby.Players.First(p => p.ClientId == snapshot.PlayerRed);
        var py = lobby.Players.First(p => p.ClientId == snapshot.PlayerYellow);

        var players = new List<Puissance4PlayerDto>
        {
            new(snapshot.PlayerRed, pr.Pseudo, "R"),
            new(snapshot.PlayerYellow, py.Pseudo, "Y")
        };

        var phase = session.Phase == GamePhase.Running ? "Running" : "Finished";

        // snapshot.Grid : int[7][6] => DTO Grid : List<List<string>> (7 colonnes de 6)
        var grid = snapshot.Grid
            .Select(col => col.Select(v => v switch
            {
                0 => "",
                1 => "R",
                2 => "Y",
                _ => ""
            }).ToList())
            .ToList();

        return new Puissance4StateDto(
            LobbyId: lobby.Id,
            Phase: phase,
            Players: players,
            CurrentPlayerId: snapshot.CurrentPlayer,
            Grid: grid,
            WinnerClientId: snapshot.Winner,
            IsDraw: snapshot.IsDraw
        );
    }

    // =========================
    // SpeedTyping
    // =========================
    private static SpeedTypingStateDto BuildSpeedTypingDto(GameSession session, Lobby lobby)
    {
        var snapshot = JsonSerializer.Deserialize<SpeedTypingSnapshot>(session.StateJson, JsonOpts)
            ?? throw new InvalidOperationException("Invalid speedtyping state");

        // Utiliser le mapper pour créer le DTO avec le classement
        return SpeedTypingMapper.ToDto(lobby.Id, snapshot);
    }
}