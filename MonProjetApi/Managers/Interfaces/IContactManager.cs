using MonProjetApi.Models;

namespace MonProjetApi.Managers.Interfaces;

public interface IContactManager
{
    Task<List<Contact>> GetAllAsync();
    Task<Contact> AddAsync(ContactForm form);
    Task<Contact?> UpdateAsync(int id, ContactForm form);
    Task<bool> DeleteAsync(int id);
}