import { ContactComponent } from './../../components/contact-modal/contact-modal';
import { ContactForm } from './../../models/contactForm.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  showGrid = false;

  constructor(public contactService: ContactService) {}

  ngOnInit(): void {
    // S'abonner au BehaviorSubject pour la mise à jour automatique
    this.contactService.contacts$.subscribe(data => {
      this.contacts = data;
      if (data.length > 0) this.showGrid = true;
    });

    // Charger les données une seule fois au démarrage
    this.contactService.getContacts().subscribe(() => {
      this.showGrid = true;
    });
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
      // addContact met à jour le BehaviorSubject automatiquement
      this.contactService.addContact(form).subscribe();
    } else {
      // updateContact met à jour le BehaviorSubject automatiquement
      this.contactService.updateContact(this.selectedContact!.id, form).subscribe();
    }
    this.isDialogOpen = false;
    this.selectedContact = null;
  }

  onDialogCancel(): void {
    this.isDialogOpen = false;
    this.selectedContact = null;
  }

  removeHandler(event: RemoveEvent): void {
    const id = event.dataItem.id;
    // removeContact met à jour le BehaviorSubject automatiquement
    this.contactService.removeContact(id).subscribe();
  }
}