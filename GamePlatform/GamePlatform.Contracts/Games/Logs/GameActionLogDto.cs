namespace GamePlatform.Contracts.Games.Logs;

public sealed record GameActionLogDto(
    Guid Id,
    Guid LobbyId,
    Guid GameSessionId,
    string GameId,
    string ActionType,
    string PayloadJson,
    Guid? ActorClientId,
    DateTimeOffset At
);