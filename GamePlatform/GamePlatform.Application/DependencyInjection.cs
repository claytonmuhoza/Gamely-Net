using GamePlatform.Application.Games;
using GamePlatform.Application.Games.Logs;
using GamePlatform.Application.Games.Morpion;
using GamePlatform.Application.Games.Puissance4;
using GamePlatform.Application.Games.SpeedTyping;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Scores;
using Microsoft.Extensions.DependencyInjection;

namespace GamePlatform.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<CreateLobbyHandler>();
        services.AddScoped<ListWaitingLobbiesHandler>();
        services.AddScoped<GetLobbyDetailsHandler>();
        services.AddScoped<JoinLobbyHandler>();
        services.AddScoped<LeaveLobbyHandler>();
        services.AddScoped<StartGameHandler>();
        services.AddScoped<PlayMorpionMoveHandler>();
        services.AddScoped<DropPuissance4DiscHandler>();
        services.AddScoped<UpdateSpeedTypingProgressHandler>();
        services.AddSingleton<ISpeedTypingTextProvider, InMemorySpeedTypingTextProvider>();
        services.AddScoped<GameActionLogger>();
        services.AddScoped<ScoreService>();
        services.AddScoped<GetCurrentGameStateHandler>();
        services.AddScoped<IGameActionLogger, GameActionLogger>();
        services.AddScoped<GetGameActionLogsHandler>();

        return services;
    }
}