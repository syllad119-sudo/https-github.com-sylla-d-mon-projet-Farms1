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
public async Task<ActionResult<Contact>> CreateContact(Contact contact)
{
    _context.Contacts.Add(contact);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetContacts), new { id = contact.Id }, contact);
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
}

  