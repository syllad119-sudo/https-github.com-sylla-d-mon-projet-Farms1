import { ContactComponent } from './../../components/contact-modal/contact-modal';
import { ContactForm } from './../../models/contactForm.model';
import { Component, OnInit } from '@angular/core';
import { KENDO_GRID, EditEvent, RemoveEvent } from '@progress/kendo-angular-grid';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import { pencilIcon, trashIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    KENDO_GRID,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KENDO_DIALOGS,
    ContactComponent,
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements OnInit {
  editIcon: SVGIcon = pencilIcon;
  deleteIcon: SVGIcon = trashIcon;

  contacts: Contact[] = [];
  isDialogOpen = false;
  selectedContact: Contact | null = null;
  isNewContact = false;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
  }

  openAddDialog(): void {
    this.selectedContact = null;
    this.isNewContact = true;
    this.isDialogOpen = true;
  }

  editHandler(event: EditEvent): void {
    this.selectedContact = { ...event.dataItem };
    this.isNewContact = false;
    this.isDialogOpen = true;
  }

  onContactSaved(form: ContactForm): void {
    if (this.isNewContact) {
      this.contacts = this.contactService.addContact(form);
    } else {
      this.contacts = this.contactService.updateContact(this.selectedContact!.id, form);
    }
    this.isDialogOpen = false;
    this.selectedContact = null;
  }

  onDialogCancel(): void {
    this.isDialogOpen = false;
    this.selectedContact = null;
  }

  removeHandler(event: RemoveEvent): void {
    this.contacts = this.contactService.removeContact(event.rowIndex);
  }
}