using MonProjetApi.Models;

namespace MonProjetApi.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
}