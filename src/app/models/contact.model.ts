// DONNEES RESUES
export interface Contact {
  id: string;
  societe: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: string;
  besoins: string[];    // ✅ ajouter cette ligne
commentaire: string;
}