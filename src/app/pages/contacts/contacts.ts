import { ContactComponent } from './../../components/contact-modal/contact-modal';
import { ContactForm } from './../../models/contactForm.model';
import { Component, OnInit, inject, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { KENDO_GRID, EditEvent, RemoveEvent } from '@progress/kendo-angular-grid';
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

  isMobile = false;
  isTablet = false;

  // déclaration correcte
  private platformId = inject(PLATFORM_ID);
  public contactService = inject(ContactService);

  ngOnInit(): void {
    this.checkScreen();

    this.contactService.contacts$.subscribe((data: Contact[]) => {
      this.contacts = data;
      if (data.length > 0) this.showGrid = true;
    });

    this.contactService.getContacts().subscribe(() => {
      this.showGrid = true;
    });
  }

  @HostListener('window:resize')
  checkScreen() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 576;
      this.isTablet = window.innerWidth > 576 && window.innerWidth <= 768;
    }
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
      this.contactService.addContact(form).subscribe();
    } else {
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
    this.contactService.removeContact(event.dataItem.id).subscribe();
  }
}