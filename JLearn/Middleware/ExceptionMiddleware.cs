using System.Net;
using JLearn.DTOs.Common;

namespace JLearn.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message) = exception switch
        {
            KeyNotFoundException => ((int)HttpStatusCode.NotFound, "Không tìm thấy tài nguyên"),
            UnauthorizedAccessException => ((int)HttpStatusCode.Unauthorized, "Không có quyền truy cập"),
            ArgumentException => ((int)HttpStatusCode.BadRequest, exception.Message),
            _ => ((int)HttpStatusCode.InternalServerError, "Đã xảy ra lỗi hệ thống")
        };

        context.Response.StatusCode = statusCode;

        var response = ApiResponse<object>.ErrorResponse(message, statusCode);
        await context.Response.WriteAsJsonAsync(response);
    }
}
