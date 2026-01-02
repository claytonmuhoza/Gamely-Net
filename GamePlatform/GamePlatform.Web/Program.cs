using GamePlatform.Application;
using GamePlatform.Application.Realtime;
using GamePlatform.Infrastructure;
using GamePlatform.Persistence;
using GamePlatform.Web.Hubs;
using GamePlatform.Web.Middlewares;
using GamePlatform.Web.Realtime;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// OpenAPI
builder.Services.AddOpenApi();

// Controllers
builder.Services.AddControllers();

// CORS
var corsPolicy = "frontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// DI layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure();

// SignalR + Notifiers
builder.Services.AddSignalR();
builder.Services.AddScoped<ILobbyNotifier, LobbyNotifier>();
builder.Services.AddScoped<IGameNotifier, GameNotifier>();

// EF Core provider
var provider = builder.Configuration["Persistence:Provider"];

if (string.Equals(provider, "SqlServer", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer")));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase(builder.Configuration["Persistence:InMemoryName"] ?? "GamePlatformDb"));
}

var app = builder.Build();

// Middleware order
app.UseGlobalExceptionHandling();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseRouting();

// CORS must be after routing and before endpoints
app.UseCors(corsPolicy);

// Map endpoints + require cors (important for hubs)
app.MapControllers().RequireCors(corsPolicy);

app.MapHub<LobbyHub>("/hubs/lobby").RequireCors(corsPolicy);
app.MapHub<GameHub>("/hubs/game").RequireCors(corsPolicy);

// Init DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (string.Equals(provider, "SqlServer", StringComparison.OrdinalIgnoreCase))
        db.Database.Migrate();
    else
        db.Database.EnsureCreated();
}

app.Run();
