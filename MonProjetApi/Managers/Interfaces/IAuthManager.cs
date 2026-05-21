using MonProjetApi.Models;

namespace MonProjetApi.Managers.Interfaces;

public interface IAuthManager
{
    Task<string?> LoginAsync(LoginDto login);
}