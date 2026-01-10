using GamePlatform.Contracts.Scores;
using GamePlatform.Domain;
using GamePlatform.Domain.Scores;

namespace GamePlatform.Application.Scores;

public sealed class ScoreService
{
    private readonly IScoreRepository _repo;

    public ScoreService(IScoreRepository repo) => _repo = repo;

    public async Task AddScoreAsync(
        GameId gameId,
        Guid clientId,
        string pseudo,
        long value,
        Guid? lobbyId,
        Guid? gameSessionId,
        CancellationToken ct)
    {
        if (clientId == Guid.Empty) throw new ArgumentException("clientId is required");
        if (string.IsNullOrWhiteSpace(pseudo)) throw new ArgumentException("pseudo is required");

        var entry = new ScoreEntry
        {
            GameId = gameId,
            ClientId = clientId,
            Pseudo = pseudo.Trim(),
            Value = value,
            LobbyId = lobbyId,
            GameSessionId = gameSessionId,
            AchievedAt = DateTimeOffset.UtcNow
        };

        await _repo.AddAsync(entry, ct);
        await _repo.SaveChangesAsync(ct);
    }

    public async Task<List<ScoreEntryDto>> GetTopAsync(GameId gameId, int limit, CancellationToken ct)
    {
        if (limit <= 0) limit = 10;
        if (limit > 100) limit = 100;

        var ordering = ScoreRules.OrderingFor(gameId);

        var list = await _repo.GetTopAsync(gameId, limit, ordering, ct);

        return list.Select(s => new ScoreEntryDto(
            GameId: s.GameId.ToString(),
            ClientId: s.ClientId,
            Pseudo: s.Pseudo,
            Value: s.Value,
            AchievedAt: s.AchievedAt
        )).ToList();
    }
}