using MonProjetApi.Data;
using MonProjetApi.Models;
using MonProjetApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MonProjetApi.Repositories;

/// <summary>
/// Repository gérant l'accès aux données des contacts en base de données.
/// Implémente les opérations CRUD via Entity Framework Core.
/// </summary>
public class ContactRepository : IContactRepository
{
    /// <summary>
    /// Contexte Entity Framework injecté pour accéder à la base de données.
    /// </summary>
    private readonly AppDbContext _context;

    /// <summary>
    /// Initialise le repository avec le contexte de base de données.
    /// </summary>
    /// <param name="context">Le contexte EF Core injecté automatiquement.</param>
    public ContactRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Récupère tous les contacts depuis la base de données.
    /// </summary>
    /// <returns>La liste de tous les contacts.</returns>
    /// <exception cref="Exception">Lancée si une erreur BDD survient.</exception>
    public async Task<List<Contact>> GetAllAsync()
    {
        try
        {
            return await _context.Contacts.ToListAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("Erreur lors de la récupération des contacts.", ex);
        }
    }

    /// <summary>
    /// Récupère un contact par son identifiant.
    /// </summary>
    /// <param name="id">L'identifiant du contact à récupérer.</param>
    /// <returns>Le contact trouvé, ou null s'il n'existe pas.</returns>
    /// <exception cref="Exception">Lancée si une erreur BDD survient.</exception>
    public async Task<Contact?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Contacts.FindAsync(id);
        }
        catch (DbUpdateException ex)
        {
            throw new Exception($"Erreur lors de la récupération du contact {id}.", ex);
        }
    }

    /// <summary>
    /// Ajoute un nouveau contact en base de données.
    /// </summary>
    /// <param name="contact">Le contact à ajouter.</param>
    /// <exception cref="Exception">Lancée si une erreur BDD survient.</exception>
    public async Task AddAsync(Contact contact)
    {
        try
        {
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("Erreur lors de l'ajout du contact.", ex);
        }
    }

    /// <summary>
    /// Sauvegarde les modifications d'un contact existant en base de données.
    /// </summary>
    /// <param name="contact">Le contact modifié à sauvegarder.</param>
    /// <exception cref="Exception">Lancée si une erreur BDD survient.</exception>
    public async Task UpdateAsync(Contact contact)
    {
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("Erreur lors de la mise à jour du contact.", ex);
        }
    }

    /// <summary>
    /// Supprime un contact de la base de données.
    /// </summary>
    /// <param name="contact">Le contact à supprimer.</param>
    /// <exception cref="Exception">Lancée si une erreur BDD survient.</exception>
    public async Task DeleteAsync(Contact contact)
    {
        try
        {
            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("Erreur lors de la suppression du contact.", ex);
        }
    }
}