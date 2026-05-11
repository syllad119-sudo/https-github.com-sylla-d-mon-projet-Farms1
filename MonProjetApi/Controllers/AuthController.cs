using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MonProjetApi.Data;
using MonProjetApi.Models;

namespace MonProjetApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("loginDto")]
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

        return Ok("Connexion réussie.");
    }

}