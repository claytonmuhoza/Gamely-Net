using GamePlatform.API.Hubs;
using GamePlatform.API.Middlewares;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Morpion;
using GamePlatform.Application.Players;
using GamePlatform.Application.Puissance;
using GamePlatform.Infrastructure.Persistence;
using GamePlatform.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var corsPolicyName = "FrontOnly";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // votre front Vite
            .AllowAnyHeader()
            .AllowAnyMethod();
            // pas besoin d'AllowCredentials si vous avez withCredentials: false côté client
    });
});

// OpenAPI / Swagger
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<GamePlatformDbContext>(options =>
    options.UseInMemoryDatabase("GamePlatformDb"));

// Repositories
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
builder.Services.AddScoped<ILobbyRepository, LobbyRepository>();
builder.Services.AddScoped<IMorpionGameRepository, MorpionGameRepository>();
builder.Services.AddScoped<IPuissanceGameRepository,PuissanceGameRepository>();

// Application Services
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<ILobbyService, LobbyService>();
builder.Services.AddScoped<IMorpionGameService, MorpionGameService>();

// SignalR
builder.Services.AddSignalR();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 1) Routing d’abord
app.UseRouting();

// 2) Puis CORS (pour que les endpoints REST + Hubs aient les bons headers)
app.UseCors(corsPolicyName);

// 3) Votre middleware global (gestion des exceptions)
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 4) Les endpoints
app.MapControllers();
app.MapHub<LobbyHub>("/hubs/lobby");
app.MapHub<MorpionHub>("/hubs/morpion");

app.Run();
