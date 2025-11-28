using GamePlatform.API.Hubs;
using GamePlatform.API.Middlewares;
using GamePlatform.Application.Lobbies;
using GamePlatform.Application.Players;
using GamePlatform.Infrastructure.Persistence;
using GamePlatform.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//Dbcontext
builder.Services.AddDbContext<GamePlatformDbContext>(options =>
    options.UseInMemoryDatabase("GamePlatformDb")); // pour démarrer vite ; remplacez par SQL Server ensuite
//Repositories
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
builder.Services.AddScoped<ILobbyRepository, LobbyRepository>();
//Application Services
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<ILobbyService, LobbyService>();
builder.Services.AddSignalR();
var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseRouting();
app.MapControllers();
app.MapHub<LobbyHub>("hubs/lobby");
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.Run();
