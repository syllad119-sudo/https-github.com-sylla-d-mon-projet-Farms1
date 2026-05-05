import { ContactComponent } from './../../components/contact-modal/contact-modal';
import { ContactForm } from './../../models/contactForm.model';
import { Component, OnInit, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import { pencilIcon, trashIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { ContactService } from '../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import { KENDO_GRID, EditEvent, RemoveEvent, ExcelModule, GridComponent } from '@progress/kendo-angular-grid';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { take } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    KENDO_GRID,
    ExcelModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KENDO_DIALOGS,
    ContactComponent,
    ExcelExportModule,
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements OnInit {
  editIcon: SVGIcon = pencilIcon;
  deleteIcon: SVGIcon = trashIcon;
  currentDate = dayjs().tz('Europe/Paris').format('DD-MM-YYYY'); 
  @ViewChild(GridComponent) grid!: GridComponent;

get dialogWidth(): number {
  return this.isMobile ? 356 : 600;
}

  contacts: Contact[] = [];
  isDialogOpen = false;
  selectedContact: Contact | null = null;
  isNewContact = false;
  showGrid = false;

  isMobile = false;
  isTablet = false;

  // confirmation suppression
  isConfirmDialogOpen = false;
  contactToDelete: Contact | null = null;

  // confirmation modification
  isConfirmEditDialogOpen = false;
  pendingEditForm: ContactForm | null = null;

 private breakpointObserver = inject(BreakpointObserver);
  private toastr = inject(ToastrService);
  public contactService = inject(ContactService);
  private cdr = inject(ChangeDetectorRef);

  get contactsForExcel() {
  return this.contacts.map(c => ({
    ...c,
    besoins: (c.besoins ?? []).join(', ')
  }));
}
  
  allDataForExcel = () => {
  return of({
    data: this.contacts.map(c => ({
      ...c,
      besoins: (c.besoins ?? []).join(', ')
    }))
  });
}


  /**
   * Initialise le composant.
   * Vérifie la taille de l'écran et charge la liste des contacts.
   */

  ngOnInit(): void {
   this.breakpointObserver
  .observe(['(max-width: 576px)', '(max-width: 768px)'])
  .subscribe(result => {
    this.isMobile = result.breakpoints['(max-width: 576px)'];
    this.isTablet = result.breakpoints['(max-width: 768px)'] && !this.isMobile;
    this.cdr.detectChanges();
  });

    this.contactService.contacts$.subscribe((data: Contact[]) => {
      this.contacts = data;
      if (data.length > 0) this.showGrid = true;
    });

    this.contactService.getContacts().subscribe(() => {
      this.showGrid = true;
    });
  }
  /**
   * Vérifie la taille de l'écran et met à jour les variables isMobile et isTablet.
   * Déclenché au chargement et à chaque redimensionnement de la fenêtre.
   */
 

  /**
   * Ouvre la modale pour ajouter un nouveau contact.
   * Réinitialise le contact sélectionné et passe en mode création.
   */
  openAddDialog(): void {
    this.selectedContact = null;
    this.isNewContact = true;
    this.isDialogOpen = true;
  }
  /**
   * Ouvre la modale pour modifier un contact existant.
   * @param event - L'événement Kendo contenant les données du contact à modifier.
   */

  editHandler(event: EditEvent): void {
    this.selectedContact = { ...event.dataItem };
    this.isNewContact = false;
    this.isDialogOpen = true;
  }

  /**
   * Gère la sauvegarde du formulaire contact.
   * En mode création : ajoute directement le contact.
   * En mode modification : ouvre la modale de confirmation avant de sauvegarder.
   * @param form - Les données du formulaire soumis.
   */
  onContactSaved(form: ContactForm): void {
    if (this.isNewContact) {
      this.contactService.addContact(form).subscribe(() => {
        this.toastr.success('Contact ajouté avec succès !');
      });
      this.isDialogOpen = false;
      this.selectedContact = null;
    } else {
      //  ouvre la confirmation avant de modifier
      this.pendingEditForm = form;
      this.isDialogOpen = false;
      this.isConfirmEditDialogOpen = true;
    }
  }
  /**
   * Confirme la modification du contact après validation dans la modale de confirmation.
   * Appelle le service pour mettre à jour le contact et affiche un toast de succès.
   */
  confirmEdit(): void {
    if (this.pendingEditForm && this.selectedContact) {
      this.contactService
        .updateContact(this.selectedContact.id, this.pendingEditForm)
        .subscribe(() => {
          this.toastr.success('Contact modifié avec succès !');
          this.pendingEditForm = null;
          this.selectedContact = null;
          this.isConfirmEditDialogOpen = false;
        });
    }
  }
  /**
   * Annule la modification du contact et ferme la modale de confirmation.
   */
  cancelEdit(): void {
    this.pendingEditForm = null;
    this.selectedContact = null;
    this.isConfirmEditDialogOpen = false;
  }

  /**
   * Ferme la modale de contact sans sauvegarder.
   */
  onDialogCancel(): void {
    this.isDialogOpen = false;
    this.selectedContact = null;
  }
  /**
   * Ouvre la modale de confirmation avant de supprimer un contact.
   * @param event - L'événement Kendo contenant les données du contact à supprimer.
   */
  removeHandler(event: RemoveEvent): void {
    this.contactToDelete = event.dataItem;
    this.isConfirmDialogOpen = true;
  }
  /**
   * Confirme la suppression du contact après validation dans la modale de confirmation.
   * Appelle le service pour supprimer le contact et affiche un toast d'erreur.
   */
  confirmDelete(): void {
    if (this.contactToDelete) {
      this.contactService.removeContact(this.contactToDelete.id).subscribe(() => {
        this.toastr.error('Contact supprimé !');
        this.contactToDelete = null;
        this.isConfirmDialogOpen = false;
      });
    }
  }
  /**
   * Annule la suppression du contact et ferme la modale de confirmation.
   */
  cancelDelete(): void {
    this.contactToDelete = null;
    this.isConfirmDialogOpen = false;
  }

  /**
   * Télécharge un fichier Excel avec un nom contenant la date du jour.
   */
 telechargerExcel() {
  this.currentDate = dayjs().tz('Europe/Paris').format('DD-MM-YYYY');

  // Passer tous les contacts (pas seulement ceux affichés dans la grid)
  this.contactService.contacts$.pipe(take(1)).subscribe(contacts => {
    this.grid.saveAsExcel();
  });
 }
}
