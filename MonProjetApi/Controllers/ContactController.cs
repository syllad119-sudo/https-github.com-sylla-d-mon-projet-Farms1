using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MonProjetApi.Managers.Interfaces;
using MonProjetApi.Models;

namespace MonProjetApi.Controllers;

[Authorize] // ← bloque toutes les requêtes sans token
[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactManager _contactManager;

    public ContactController(IContactManager contactManager)
    {
        _contactManager = contactManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetContacts()
    {
        var contacts = await _contactManager.GetAllAsync();
        return Ok(contacts);
    }

    [HttpPost]
    public async Task<IActionResult> CreateContact([FromBody] ContactForm form)
    {
        await _contactManager.AddAsync(form);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContact(int id, [FromBody] ContactForm form)
    {
        var success = await _contactManager.UpdateAsync(id, form);
        if (!success) return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContact(int id)
    {
        var success = await _contactManager.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}