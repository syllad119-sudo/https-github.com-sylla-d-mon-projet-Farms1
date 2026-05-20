using MonProjetApi.Models;
using MonProjetApi.Managers.Interfaces;
using MonProjetApi.Repositories.Interfaces;

namespace MonProjetApi.Managers;

public class ContactManager : IContactManager
{
    private readonly IContactRepository _contactRepository;

    public ContactManager(IContactRepository contactRepository)
    {
        _contactRepository = contactRepository;
    }

    public async Task<List<Contact>> GetAllAsync()
    {
        return await _contactRepository.GetAllAsync();
    }

    public async Task AddAsync(ContactForm form)
    {
        var contact = new Contact
        {
            Societe = form.Societe,
            Nom = form.Nom,
            Prenom = form.Prenom,
            Email = form.Email,
            Telephone = form.Telephone,
            Pays = form.Pays,
            Langue = form.Langue,
            Besoins = form.Besoins,
            Commentaire = form.Commentaire,
            DateCreation = DateTime.Now
        };
        await _contactRepository.AddAsync(contact);
    }

    public async Task<bool> UpdateAsync(int id, ContactForm form)
    {
        var contact = await _contactRepository.GetByIdAsync(id);
        if (contact == null) return false;

        contact.Societe = form.Societe;
        contact.Nom = form.Nom;
        contact.Prenom = form.Prenom;
        contact.Email = form.Email;
        contact.Telephone = form.Telephone;
        contact.Pays = form.Pays;
        contact.Langue = form.Langue;
        contact.Besoins = form.Besoins;
        contact.Commentaire = form.Commentaire;

        await _contactRepository.UpdateAsync(contact);
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var contact = await _contactRepository.GetByIdAsync(id);
        if (contact == null) return false;

        await _contactRepository.DeleteAsync(contact);
        return true;
    }
}