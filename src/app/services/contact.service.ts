import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ContactForm } from '../models/contactForm.model';

/**
 * Service gérant les opérations CRUD sur les contacts.
 * Utilise un BehaviorSubject pour maintenir la liste des contacts
 * à jour automatiquement sans recharger depuis l'API.
 */

@Injectable({ providedIn: 'root' })
export class ContactService {
 /** URL de base de l'API des contacts. */
private apiUrl = 'http://localhost:5143/api/contact';
 /**
   * BehaviorSubject contenant la liste des contacts.
   * Permet une mise à jour automatique dans tous les composants abonnés.
   */
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
   /** Observable public exposant la liste des contacts en temps réel. */
  contacts$ = this.contactsSubject.asObservable();

  /**
   * Injecte le service HttpClient pour effectuer les requêtes HTTP.
   * @param http - Service HTTP Angular.
   */

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les contacts depuis l'API.
   * Met à jour le BehaviorSubject avec les données reçues.
   * @returns Un Observable contenant la liste des contacts.
   */

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl).pipe(
      tap(data => this.contactsSubject.next(data)) // met à jour le subject
    );
  }

  /**
   * Ajoute un nouveau contact via l'API.
   * Met à jour le BehaviorSubject en ajoutant le nouveau contact
   * à la liste existante sans recharger depuis l'API.
   * @param form - Les données du formulaire du nouveau contact.
   * @returns Un Observable contenant le contact créé.
   */
  addContact(form: ContactForm): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, form).pipe(
      tap(newContact => {
        const current = this.contactsSubject.getValue();
        this.contactsSubject.next([...current, newContact]); 
      })
    );
  }
/**
   * Met à jour un contact existant via l'API.
   * Met à jour le BehaviorSubject en remplaçant le contact modifié
   * dans la liste existante sans recharger depuis l'API.
   * @param id - L'identifiant unique du contact à modifier.
   * @param form - Les nouvelles données du formulaire.
   * @returns Un Observable contenant le contact mis à jour.
   */
  updateContact(id: number, form: ContactForm): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, form).pipe(
      tap(updated => {
      const current = this.contactsSubject.getValue();
      const index = current.findIndex(c => c.id === id);
      const updatedList = current.map(c => c.id === id ? updated : c);
      this.contactsSubject.next(updatedList);
      })
    );
  }

  /**
   * Supprime un contact via l'API.
   * Met à jour le BehaviorSubject en retirant le contact supprimé
   * de la liste existante sans recharger depuis l'API.
   * @param id - L'identifiant unique du contact à supprimer.
   * @returns Un Observable vide signalant la fin de la suppression.
   */
  removeContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.contactsSubject.getValue();
        this.contactsSubject.next(current.filter(c => c.id !== id)); // supprime sans recharger
      })
    );
  }
}