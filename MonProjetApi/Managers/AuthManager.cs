using MonProjetApi.Models;
using MonProjetApi.Managers.Interfaces;
using MonProjetApi.Repositories.Interfaces;

namespace MonProjetApi.Managers;

public class AuthManager : IAuthManager
{
    private readonly IUserRepository _userRepository;

    public AuthManager(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> LoginAsync(LoginDto login)
    {
        var user = await _userRepository.GetByUsernameAsync(login.Username);
        if (user == null) return false;
        return BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash);
    }
}