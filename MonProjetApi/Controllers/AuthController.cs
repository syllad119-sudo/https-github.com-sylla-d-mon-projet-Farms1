using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MonProjetApi.Data;
using MonProjetApi.Models;

namespace MonProjetApi.Controllers;

/// <summary>
/// Contrôleur gérant l'authentification de l'administrateur.
/// Expose les endpoints de connexion.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    /// <summary>
    /// Contexte de base de données injecté pour accéder aux utilisateurs.
    /// </summary>
    private readonly AppDbContext _context;

    /// <summary>
    /// Initialise le contrôleur avec le contexte de base de données.
    /// </summary>
    /// <param name="context">Le contexte EF Core.</param>
    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Authentifie l'administrateur avec son identifiant et mot de passe.
    /// Vérifie les identifiants contre la base de données.
    /// Retourne un message de succès si les identifiants sont valides.
    /// </summary>
    /// <param name="login">Les données de connexion (username + password).</param>
    /// <returns>200 OK si connexion réussie, 401 Unauthorized sinon.</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == login.Username);

        if (user == null)
        {
            return Unauthorized("Utilisateur introuvable.");
        }

        bool passwordValid = BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash);

        if (!passwordValid)
        {
            return Unauthorized("Mot de passe incorrect.");
        }

        return Ok(new { message = "Connexion réussie" });
    }
}