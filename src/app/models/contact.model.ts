// DONNEES RESUES
export interface Contact {
  id: number;
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
