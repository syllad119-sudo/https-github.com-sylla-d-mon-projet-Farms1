using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MonProjetApi.Data;
using MonProjetApi.Models;
namespace MonProjetApi.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
 // Controller actions would go here
 private readonly AppDbContext _context;

 public ContactController(AppDbContext context)
 {
     _context = context;
 }

[HttpGet]
public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
{
    return await _context.Contacts.ToListAsync();   
}      

[HttpPost]
public async Task<IActionResult> CreateContact([FromBody] ContactForm form)
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

    _context.Contacts.Add(contact);
    await _context.SaveChangesAsync();
    return Ok(contact);
}

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteContact(int id)
{
    var contact = await _context.Contacts.FindAsync(id);
    if (contact == null)
    {
        return NotFound();
    }

    _context.Contacts.Remove(contact);
    await _context.SaveChangesAsync();

    return NoContent();
}

 [HttpPut("{id}")]
public async Task<IActionResult> UpdateContact(int id, [FromBody] ContactForm form)
{
    var contact = await _context.Contacts.FindAsync(id);
    if (contact == null) return NotFound();

    contact.Societe = form.Societe;
    contact.Nom = form.Nom;
    contact.Prenom = form.Prenom;
    contact.Email = form.Email;
    contact.Telephone = form.Telephone;
    contact.Pays = form.Pays;
    contact.Langue = form.Langue;
    contact.Besoins = form.Besoins;
    contact.Commentaire = form.Commentaire;

    await _context.SaveChangesAsync();
    return Ok(contact);
}
private bool ContactExists(int id)
{
    return _context.Contacts.Any(e => e.Id == id);
}
}