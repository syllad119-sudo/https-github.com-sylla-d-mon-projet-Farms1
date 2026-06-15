import { ContactComponent } from './../../components/contact-modal/contact-modal';
import { ContactForm } from './../../models/contactForm.model';
import { Component, OnInit, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import { pencilIcon, trashIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { ContactService } from '../../services/contact.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NotificationModule } from '@progress/kendo-angular-notification';
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
import { Router } from '@angular/router';


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
    NotificationModule,
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

  isConfirmDialogOpen = false;
  contactToDelete: Contact | null = null;

  isConfirmEditDialogOpen = false;
  pendingEditForm: ContactForm | null = null;

  private breakpointObserver = inject(BreakpointObserver);
  private notificationService = inject(NotificationService);
  public contactService = inject(ContactService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  /**
   * Affiche une notification toast en bas à droite de l'écran.
   * @param content - Le message à afficher.
   * @param style - Le style de la notification (success, error, warning, info).
   */
  private showToast(content: string, style: 'success' | 'error' | 'warning' | 'info'): void {
    this.notificationService.show({
      content,
      type: { style, icon: true },
      position: { horizontal: 'right', vertical: 'bottom' },
      animation: { type: 'slide', duration: 400 },
      hideAfter: 3000,
    });
  }

  /**
   * Déconnecte l'utilisateur en supprimant le token et redirige vers la page de login.
   */
  logout() {
    localStorage.removeItem('token');
    console.log('🔄 Déconnexion effectuée depuis la page contacts.');
    this.router.navigate(['/login']);
  }

  /**
   * Retourne les contacts formatés pour l'export Excel.
   */
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
   */
  ngOnInit(): void {
    console.log('🔄 Initialisation du composant Contacts...');

    this.breakpointObserver
      .observe(['(max-width: 576px)', '(max-width: 768px)'])
      .subscribe(result => {
        this.isMobile = result.breakpoints['(max-width: 576px)'];
        this.isTablet = result.breakpoints['(max-width: 768px)'] && !this.isMobile;
        this.cdr.detectChanges();
      });

    this.contactService.contacts$.subscribe({
      next: (data: Contact[]) => {
        this.contacts = data;
        if (data.length > 0) this.showGrid = true;
      },
      error: (error) => {
        console.error('❌ Erreur lors de la souscription aux contacts.', error);
      }
    });

    this.contactService.getContacts().subscribe({
      next: () => {
        this.showGrid = true;
        console.log('✅ Contacts chargés avec succès.');
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des contacts.', error);
      }
    });
  }

  /**
   * Ouvre la modale pour ajouter un nouveau contact.
   */
  openAddDialog(): void {
    console.log('🔄 Ouverture de la modale d\'ajout de contact.');
    this.selectedContact = null;
    this.isNewContact = true;
    this.isDialogOpen = true;
  }

  /**
   * Ouvre la modale pour modifier un contact existant.
   */
  editHandler(event: EditEvent): void {
    console.log(`🔄 Ouverture de la modale de modification pour le contact ID ${event.dataItem.id}.`);
    this.selectedContact = { ...event.dataItem };
    this.isNewContact = false;
    this.isDialogOpen = true;
  }

  /**
   * Gère la sauvegarde du formulaire contact.
   */
  onContactSaved(form: ContactForm): void {
    if (this.isNewContact) {
      console.log('🔄 Ajout d\'un nouveau contact...', form);
      this.contactService.addContact(form).subscribe({
        next: () => {
          this.showToast('Contact ajouté avec succès !', 'success');
          console.log('✅ Contact ajouté avec succès.');
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'ajout du contact.', error);
        }
      });
      this.isDialogOpen = false;
      this.selectedContact = null;
    } else {
      console.log('🔄 Demande de confirmation pour la modification du contact.');
      this.pendingEditForm = form;
      this.isDialogOpen = false;
      this.isConfirmEditDialogOpen = true;
    }
  }

  /**
   * Confirme la modification du contact.
   */
  confirmEdit(): void {
    if (this.pendingEditForm && this.selectedContact) {
      console.log(`🔄 Confirmation de la modification du contact ID ${this.selectedContact.id}.`);
      this.contactService
        .updateContact(this.selectedContact.id, this.pendingEditForm)
        .subscribe({
          next: () => {
            this.showToast('Contact modifié avec succès !', 'success');
            console.log('✅ Contact modifié avec succès.');
            this.pendingEditForm = null;
            this.selectedContact = null;
            this.isConfirmEditDialogOpen = false;
          },
          error: (error) => {
            console.error('❌ Erreur lors de la modification du contact.', error);
          }
        });
    }
  }

  /**
   * Annule la modification du contact.
   */
  cancelEdit(): void {
    console.log('🔄 Modification du contact annulée.');
    this.pendingEditForm = null;
    this.selectedContact = null;
    this.isConfirmEditDialogOpen = false;
  }

  /**
   * Ferme la modale sans sauvegarder.
   */
  onDialogCancel(): void {
    console.log('🔄 Fermeture de la modale sans sauvegarde.');
    this.isDialogOpen = false;
    this.selectedContact = null;
  }

  /**
   * Ouvre la modale de confirmation avant de supprimer un contact.
   */
  removeHandler(event: RemoveEvent): void {
    console.log(`🔄 Demande de suppression du contact ID ${event.dataItem.id}.`);
    this.contactToDelete = event.dataItem;
    this.isConfirmDialogOpen = true;
  }

  /**
   * Confirme la suppression du contact.
   */
  confirmDelete(): void {
    if (this.contactToDelete) {
      console.log(`🔄 Confirmation de la suppression du contact ID ${this.contactToDelete.id}.`);
      this.contactService.removeContact(this.contactToDelete.id).subscribe({
        next: () => {
          this.showToast('Contact supprimé !', 'warning');
          console.log('✅ Contact supprimé avec succès.');
          this.contactToDelete = null;
          this.isConfirmDialogOpen = false;
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression du contact.', error);
        }
      });
    }
  }

  /**
   * Annule la suppression du contact.
   */
  cancelDelete(): void {
    console.log('🔄 Suppression du contact annulée.');
    this.contactToDelete = null;
    this.isConfirmDialogOpen = false;
  }

  /**
   * Télécharge un fichier Excel.
   */
  telechargerExcel() {
    console.log('🔄 Téléchargement du fichier Excel...');
    this.currentDate = dayjs().tz('Europe/Paris').format('DD-MM-YYYY');
    this.contactService.contacts$.pipe(take(1)).subscribe({
      next: () => {
        this.grid.saveAsExcel();
        console.log('✅ Fichier Excel téléchargé avec succès.');
      },
      error: (error) => {
        console.error('❌ Erreur lors du téléchargement du fichier Excel.', error);
      }
    });
  }
}