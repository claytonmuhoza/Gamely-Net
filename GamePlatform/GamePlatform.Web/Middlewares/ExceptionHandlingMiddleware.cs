using System.Text.Json;

namespace GamePlatform.Web.Middlewares;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // log server-side
            _logger.LogError(ex, "Unhandled exception");

            var (status, code, message) = MapException(ex);

            if (!context.Response.HasStarted)
            {
                context.Response.Clear();
                context.Response.StatusCode = status;
                context.Response.ContentType = "application/json";

                var payload = new ApiError(code, message);

                await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
            }
        }
    }

    private static (int status, string code, string message) MapException(Exception ex)
    {
        return ex switch
        {
            ArgumentException => (StatusCodes.Status400BadRequest, "BAD_REQUEST", ex.Message),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "UNAUTHORIZED", ex.Message),
            KeyNotFoundException => (StatusCodes.Status404NotFound, "NOT_FOUND", ex.Message),
            InvalidOperationException => (StatusCodes.Status409Conflict, "CONFLICT", ex.Message),
            _ => (StatusCodes.Status500InternalServerError, "INTERNAL_ERROR", "An unexpected error occurred")
        };
    }

    private sealed record ApiError(string Code, string Error);
}