using MonProjetApi.Models;

namespace MonProjetApi.Managers.Interfaces;

public interface IContactManager
{
    Task<List<Contact>> GetAllAsync();
    Task AddAsync(ContactForm form);
    Task<bool> UpdateAsync(int id, ContactForm form);
    Task<bool> DeleteAsync(int id);
}