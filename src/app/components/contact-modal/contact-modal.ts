import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { Contact } from '../../models/contact.model';
import { ContactForm } from '../../models/contactForm.model';
import { SelectionBesoinsComponent } from '../selection-besoins/selection-besoins';
//                                                                
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KENDO_BUTTONS, KENDO_INPUTS, SelectionBesoinsComponent],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss',
})
export class ContactComponent implements OnInit {
  @Input() contact: Contact | null = null;
  @Input() isNew = false;
  @Output() save = new EventEmitter<ContactForm>();
  @Output() cancel = new EventEmitter<void>();

  contactForm!: FormGroup;

  //  Liste des besoins disponibles
  besoinsDisponibles: string[] = [
    'Contrôle de la production - Production control',
    'Fiabilité des informations - Reliability',
    'Précision des informations - Accuracy',
    'Maladies - Diseases',
    'Gestion de la main d\'œuvre - Workforce management',
    'Prédictions des récoltes - Crop forecasts',
    'Traçabilité - Traceability',
    'Vols & Pertes - Theft & Loss',
    'Productivité performance - Productivity and perf.',
    'Maîtrise des coûts - Cost control',
    'Gestion des parcelles - Parcel management',
  ];

  // État local de la sélection
  besoinsSelectionnes: string[] = [];

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      societe:     new FormControl(this.contact?.societe ?? '',     [Validators.required, Validators.minLength(2)]),
      nom:         new FormControl(this.contact?.nom ?? '',         [Validators.required, Validators.minLength(2)]),
      prenom:      new FormControl(this.contact?.prenom ?? '',      [Validators.required, Validators.minLength(2)]),
      email:       new FormControl(this.contact?.email ?? '',       [Validators.required, Validators.email]),
      telephone:   new FormControl(this.contact?.telephone ?? '',   [Validators.required]),
      pays:        new FormControl(this.contact?.pays ?? '',        [Validators.required, Validators.minLength(2)]),
      besoins:     new FormControl(this.contact?.besoins ?? []),    //  ajouté ici
      commentaire: new FormControl(this.contact?.commentaire ?? ''),
    });

    //  Initialiser la sélection visuelle si on est en mode édition
    this.besoinsSelectionnes = this.contact?.besoins ?? [];
  }

  //  Appelé par le composant enfant quand l'utilisateur clique sur un bouton
  onBesoinsChange(selection: string[]): void {
    this.besoinsSelectionnes = selection;
    this.contactForm.get('besoins')?.setValue(selection); // ← sync avec le FormGroup
  }

  handleSubmit(): void {
    if (this.contactForm.valid) {
      this.save.emit(this.contactForm.value as ContactForm);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}