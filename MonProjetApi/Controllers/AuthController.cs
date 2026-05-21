using Microsoft.AspNetCore.Mvc;
using MonProjetApi.Managers.Interfaces;
using MonProjetApi.Models;

namespace MonProjetApi.Controllers;

// Gère la connexion et retourne un token JWT
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthManager _authManager;

    public AuthController(IAuthManager authManager)
    {
        _authManager = authManager;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {
        var token = await _authManager.LoginAsync(login);

        if (token == null)
            return Unauthorized("Identifiants invalides.");

        // Retourne le token au client
        return Ok(new { token });
    }
}