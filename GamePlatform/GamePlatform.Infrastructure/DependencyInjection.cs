using GamePlatform.Application.Lobbies;
using GamePlatform.Infrastructure.Lobbies;
using GamePlatform.Application.Games;
using GamePlatform.Application.Games.Logs;
using GamePlatform.Application.Scores;
using GamePlatform.Infrastructure.Games;
using GamePlatform.Infrastructure.Games.Logs;
using GamePlatform.Infrastructure.Scores;
using Microsoft.Extensions.DependencyInjection;

namespace GamePlatform.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IGameActionLogRepository, GameActionLogRepository>();
        services.AddScoped<ILobbyRepository, LobbyRepository>();
        services.AddScoped<IGameSessionRepository, GameSessionRepository>();
        services.AddScoped<IScoreRepository, ScoreRepository>();
        return services;
    }
}