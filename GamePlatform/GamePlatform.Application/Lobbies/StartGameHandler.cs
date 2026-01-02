using System.Text.Json;
using GamePlatform.Application.Games;
using GamePlatform.Application.Games.Logs;
using GamePlatform.Application.Games.Morpion;
using GamePlatform.Application.Games.Puissance4;
using GamePlatform.Application.Games.SpeedTyping;
using GamePlatform.Application.Realtime;
using GamePlatform.Contracts.Lobbies;
using GamePlatform.Domain;

namespace GamePlatform.Application.Lobbies;

public sealed class StartGameHandler
{
    private readonly ILobbyRepository _repo;
    private readonly IGameSessionRepository _sessions;
    private readonly ILobbyNotifier _notifier;
    private readonly ISpeedTypingTextProvider _textProvider;
    private readonly IGameActionLogger _actionLogger;
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);
    public StartGameHandler(ILobbyRepository repo, IGameSessionRepository sessions, ILobbyNotifier notifier, ISpeedTypingTextProvider textProvider, GameActionLogger actionLogger)
    {
        _repo = repo;
        _sessions = sessions;
        _notifier = notifier;
        _textProvider = textProvider;
        _actionLogger = actionLogger;
    }

    public async Task<GameSession> Handle(Guid lobbyId, StartGameRequest req, CancellationToken ct)
    {
        var lobby = await _repo.GetByIdAsync(lobbyId, ct) ?? throw new KeyNotFoundException("Lobby not found");

        if (lobby.HostClientId != req.ClientId)
            throw new UnauthorizedAccessException("Only host can start");

        if (lobby.Status != LobbyStatus.Waiting)
            throw new InvalidOperationException("Lobby cannot be started");

        var minPlayers = 2; // selon cahier des charges
        if (lobby.Players.Count < minPlayers)
            throw new InvalidOperationException("Not enough players");

        lobby.Status = LobbyStatus.InGame;

        var initialState = BuildInitialStateJson(lobby, _textProvider);
        var session = new GameSession
        {
            LobbyId = lobby.Id,
            GameId = lobby.GameId,
            Phase = GamePhase.Running,
            StateJson = initialState,
            CreatedAt = DateTimeOffset.UtcNow
        };

        await _sessions.AddAsync(session, ct);
        await _repo.SaveChangesAsync(ct);
        await _sessions.SaveChangesAsync(ct);
        await _notifier.NotifyLobbyUpdated(lobby.Id, ct);
        await _notifier.NotifyLobbyListUpdated(ct);
        await _actionLogger.LogAsync(
            session.Id,
            "START_GAME",
            JsonSerializer.Serialize(new { lobbyId, gameId = session.GameId.ToString() }),
            req.ClientId,
            ct);
        await _actionLogger.LogAsync(
            session.Id,
            GameActionTypes.StateSnapshot,
           initialState,
            req.ClientId,
            ct);
        return session;
    }
    private static string BuildInitialStateJson(Lobby lobby, ISpeedTypingTextProvider textProvider)
    {
        if (lobby.GameId == GameId.Morpion)
        {
            var p0 = lobby.Players[0];
            var p1 = lobby.Players[1];

            var snapshot = new MorpionSnapshot
            {
                PlayerX = p0.ClientId,
                PlayerO = p1.ClientId,
                CurrentPlayer = p0.ClientId,
                Board = new int[9],
                Winner = null,
                IsDraw = false
            };

            return JsonSerializer.Serialize(snapshot);
        }
        
        if (lobby.GameId == GameId.Puissance4)
        {
            var p0 = lobby.Players[0];
            var p1 = lobby.Players[1];

            var snapshot = new Puissance4Snapshot
            {
                PlayerRed = p0.ClientId,
                PlayerYellow = p1.ClientId,
                CurrentPlayer = p0.ClientId,
                Grid = Enumerable.Range(0, 7).Select(_ => new int[6]).ToArray(),
                Winner = null,
                IsDraw = false
            };

            return JsonSerializer.Serialize(snapshot);
        }
        if (lobby.GameId == GameId.SpeedTyping)
        {
            // Texte
            var (textId, text) = textProvider.GetRandomText(); // on va injecter _textProvider

            var startedAtMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            var snapshot = new SpeedTypingSnapshot
            {
                TextId = textId,
                Text = text,
                StartedAtUnixMs = startedAtMs,
                EndedAtUnixMs = null,
                MinUpdateIntervalMs = 100,
                Runners = lobby.Players.Select(p => new RunnerSnapshot
                {
                    ClientId = p.ClientId,
                    Pseudo = p.Pseudo,
                    Progress = 0,
                    FinishedAtUnixMs = null,
                    LastUpdateUnixMs = startedAtMs
                }).ToList()
            };

            return JsonSerializer.Serialize(snapshot);
        }
        return "{}";
    }
}