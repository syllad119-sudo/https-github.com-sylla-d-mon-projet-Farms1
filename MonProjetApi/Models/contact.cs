namespace MonProjetApi.Models;

public class Contact {
    public int Id { get; set; }
    public string Societe { get; set; }= string.Empty;
    public string Nom { get; set; }= string.Empty;
    public string Prenom { get; set; }= string.Empty;
    public string Email { get; set; }= string.Empty;
    public string Telephone { get; set; }= string.Empty;
    public string Pays { get; set; }= string.Empty;
    public string Langue    { get; set; }= string.Empty;
    public ICollection<Besoin> Besoins { get; set; } = new List<Besoin>();
    public string   Commentaire  { get; set; }= string.Empty;
    public DateTime DateCreation { get; set; } = DateTime.Now;
}
