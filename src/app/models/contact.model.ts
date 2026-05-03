// DONNEES RESUES
export interface Contact {
  id: string;
  societe: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: string;
  langue: string;
  besoins: string[];
  commentaire: string;
  dateCreation: string;
}
