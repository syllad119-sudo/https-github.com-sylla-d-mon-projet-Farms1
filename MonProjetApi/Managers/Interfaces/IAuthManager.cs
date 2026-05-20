using MonProjetApi.Models;

namespace MonProjetApi.Managers.Interfaces;

public interface IAuthManager
{
    Task<bool> LoginAsync(LoginDto login);
}