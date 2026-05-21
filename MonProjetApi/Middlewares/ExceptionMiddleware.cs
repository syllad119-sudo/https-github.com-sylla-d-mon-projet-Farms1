using System.Net;
using Microsoft.EntityFrameworkCore;

namespace MonProjetApi.Middlewares;

// Attrape toutes les erreurs non gérées de l'application
// et retourne un JSON propre au lieu de planter
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
            // Passe au controller
            await _next(context);
        }
        catch (DbUpdateException ex)
        {
            // Erreur BDD (connexion perdue, contrainte violée, etc.)
            _logger.LogError(ex, "Erreur base de données");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await context.Response.WriteAsJsonAsync(new { message = "Erreur base de données." });
        }
        catch (Exception ex)
        {
            // Toute autre erreur inattendue
            _logger.LogError(ex, "Erreur inattendue");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await context.Response.WriteAsJsonAsync(new { message = "Erreur interne du serveur." });
        }
    }
}