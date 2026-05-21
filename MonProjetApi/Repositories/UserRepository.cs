using MonProjetApi.Data;
using MonProjetApi.Models;
using MonProjetApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MonProjetApi.Repositories;

// Accès aux données des utilisateurs via EF Core
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    // Retourne null si l'utilisateur n'existe pas
    public async Task<User?> GetByUsernameAsync(string username)
    {
        try
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Erreur lors de la récupération de l'utilisateur {username}.", ex);
        }
    }
}