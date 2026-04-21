import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ContactForm } from '../models/contactForm.model';

@Injectable({ providedIn: 'root' })
export class ContactService {

  private apiUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  addContact(form: ContactForm): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, form);
  }

  updateContact(id: string, form: ContactForm): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, form);
  }

  removeContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}