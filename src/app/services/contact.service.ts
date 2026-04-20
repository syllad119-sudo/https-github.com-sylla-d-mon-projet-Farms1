import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactForm } from '../models/contactForm.model';
import CONTACTS from '../../assets/contact.json';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [...CONTACTS];

  getContacts(): Contact[] {
    return this.contacts;
  }

  addContact(form: ContactForm): Contact[] {
    const newContact: Contact = {
      id: this.contacts.length + 1,
      societe: form.societe,
      nom: form.nom,
      prenom: form.prenom,
      pays: form.pays,
    };
    this.contacts = [newContact, ...this.contacts];
    return this.contacts;
  }

  updateContact(id: number, form: ContactForm): Contact[] {
    this.contacts = this.contacts.map(c =>
      c.id === id
        ? { ...c, societe: form.societe, nom: form.nom, prenom: form.prenom, pays: form.pays }
        : c
    );
    return this.contacts;
  }

  removeContact(index: number): Contact[] {
    this.contacts = this.contacts.filter((_, i) => i !== index);
    return this.contacts;
  }
}