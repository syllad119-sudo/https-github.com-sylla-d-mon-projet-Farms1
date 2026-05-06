using Microsoft.EntityFrameworkCore;
using MonProjetApi.Models;
namespace MonProjetApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
public DbSet<User> Users { get; set; }
public DbSet<Contact> Contacts { get; set; }
}
