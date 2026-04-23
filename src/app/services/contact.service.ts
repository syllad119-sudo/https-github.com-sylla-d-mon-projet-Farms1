import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ContactForm } from '../models/contactForm.model';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private apiUrl = 'http://localhost:3000/contacts';

  // BehaviorSubject pour la mise à jour automatique
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl).pipe(
      tap(data => this.contactsSubject.next(data)) // met à jour le subject
    );
  }

  addContact(form: ContactForm): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, form).pipe(
      tap(newContact => {
        const current = this.contactsSubject.getValue();
        this.contactsSubject.next([...current, newContact]); // ajoute sans recharger
      })
    );
  }

  updateContact(id: string, form: ContactForm): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, form).pipe(
      tap(updated => {
        const current = this.contactsSubject.getValue();
        const index = current.findIndex(c => c.id === id);
        current[index] = updated;
        this.contactsSubject.next([...current]); // met à jour sans recharger
      })
    );
  }

  removeContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.contactsSubject.getValue();
        this.contactsSubject.next(current.filter(c => c.id !== id)); // supprime sans recharger
      })
    );
  }
}