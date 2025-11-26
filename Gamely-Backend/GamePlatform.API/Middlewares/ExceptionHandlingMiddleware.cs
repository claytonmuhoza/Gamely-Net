using System.Net;
using System.Text.Json;
using GamePlatform.Application.Exceptions;

namespace GamePlatform.API.Middlewares;

public class ExceptionHandlingMiddleware
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
        catch (ApplicationValidationException exception)
        {
            _logger.LogWarning(exception, "Application validation error");

            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";

            var body = new
            {
                type = "https://httpstatuses.com/400",
                title = "Validation error",
                status = 400,
                detail = exception.Message,
                errorCode = exception.ErrorCode
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(body));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var body = new
            {
                type = "https://httpstatuses.com/500",
                title = "An unexpected error occurred",
                status = 500,
                detail = "An unexpected error occurred. Please try again later."
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(body));
        }
    }
}