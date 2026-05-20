using MonProjetApi.Data;
using MonProjetApi.Models;
using MonProjetApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MonProjetApi.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);
    }
}