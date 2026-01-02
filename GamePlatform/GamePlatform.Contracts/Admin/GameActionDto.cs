using System.Text.Json;

namespace GamePlatform.Contracts.Admin;

public sealed record GameActionDto(
    Guid Id,
    Guid GameSessionId,
    string ActionType,
    Guid? ActorClientId,
    DateTimeOffset At,
    JsonElement Payload
);