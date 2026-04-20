import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactForm } from '../models/contactForm.model';
import CONTACTS from '../../assets/contact.json';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = _.cloneDeep(CONTACTS) as Contact[];

  getContacts(): Contact[] {
    return this.contacts;
  }

  addContact(form: ContactForm): Contact[] {
    const newContact: Contact = {
      id: _.maxBy(this.contacts, 'id')?.id ?? 0 + 1, // ← id unique basé sur le max
      ..._.pick(form, ['societe', 'nom', 'prenom', 'pays']), // ← pick les champs utiles
    };
    this.contacts = [newContact, ...this.contacts];
    return this.contacts;
  }

  updateContact(id: number, form: ContactForm): Contact[] {
    const index = _.findIndex(this.contacts, { id }); // ← trouve l'index par id
    if (index !== -1) {
      this.contacts[index] = {
        ...this.contacts[index],
        ..._.pick(form, ['societe', 'nom', 'prenom', 'pays']), // ← merge uniquement les champs utiles
      };
      this.contacts = _.cloneDeep(this.contacts); // ← force la détection de changement Angular
    }
    return this.contacts;
  }

  removeContact(index: number): Contact[] {
    this.contacts = _.filter(this.contacts, (_, i) => i !== index); // ← filter lodash
    return this.contacts;
  }
}