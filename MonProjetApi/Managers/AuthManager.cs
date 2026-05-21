using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MonProjetApi.Models;
using MonProjetApi.Managers.Interfaces;
using MonProjetApi.Repositories.Interfaces;

namespace MonProjetApi.Managers;

// Gère la connexion et génère un token JWT si les identifiants sont corrects
public class AuthManager : IAuthManager
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthManager(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    // Retourne le token JWT si connexion réussie, null sinon
    public async Task<string?> LoginAsync(LoginDto login)
    {
        var user = await _userRepository.GetByUsernameAsync(login.Username);
        if (user == null) return null;

        // Vérifie le mot de passe avec BCrypt
        bool passwordValid = BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash);
        if (!passwordValid) return null;

        // Génère le token JWT
        return GenerateToken(user);
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}