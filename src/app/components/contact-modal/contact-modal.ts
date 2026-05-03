import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { Contact } from '../../models/contact.model';
import { ContactForm } from '../../models/contactForm.model';
import { SelectionBesoinsComponent } from '../selection-besoins/selection-besoins';
/**
 * Composant modal de formulaire contact.
 * Permet d'ajouter un nouveau contact ou de modifier un contact existant.
 * Émet les événements `save` et `cancel` vers le composant parent.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KENDO_BUTTONS, KENDO_INPUTS, SelectionBesoinsComponent],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss',
})
export class ContactComponent implements OnInit {
  /** Contact à modifier. Null si on est en mode création. */
  @Input() contact: Contact | null = null;
   /** Indique si on est en mode création (true) ou modification (false). */
  @Input() isNew = false;

  /** Événement émis lors de la soumission du formulaire avec les données saisies. */
  @Output() save = new EventEmitter<ContactForm>();
  /** Événement émis lors de l'annulation du formulaire. */
  @Output() cancel = new EventEmitter<void>();
  
/** Groupe de contrôles du formulaire réactif. */
  contactForm!: FormGroup;

/** Liste de tous les besoins disponibles affichés dans le composant de sélection. */
  besoinsDisponibles: string[] = [
    'Contrôle de la production ',
    'Fiabilité des informations ',
    'Précision des informations ',
    'Maladies ',
    'Gestion de la main d\'œuvre',
    'Prédictions des récoltes ',
    'Traçabilité ',
    'Vols & Pertes ',
    'Productivité performance ',
    'Maîtrise des coûts ',
    'Gestion des parcelles ',
  ];

   /** Liste des besoins actuellement sélectionnés par l'utilisateur. */
   besoinsSelectionnes: string[] = [];
   /**
   * Initialise le formulaire réactif avec les valeurs du contact existant
   * ou des valeurs vides si on est en mode création.
   * Initialise également la sélection des besoins en mode édition.
   */

   langues = [
  { code: 'FR', label: 'Français',  flag: '../../../assets/images/france.png' },
  { code: 'EN', label: 'Anglais',   flag: '../../../assets/images/royaume-uni.png' },
  { code: 'ES', label: 'Espagnol',  flag: '../../../assets/images/drapeau.png' },
  { code: 'PT', label: 'Portugais', flag: '../../../assets/images/bresil.png' },
];

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      societe:     new FormControl(this.contact?.societe ?? '',     [Validators.required, Validators.minLength(2)]),
      nom:         new FormControl(this.contact?.nom ?? '',         [Validators.required, Validators.minLength(2)]),
      prenom:      new FormControl(this.contact?.prenom ?? '',      [Validators.required, Validators.minLength(2)]),
      email:       new FormControl(this.contact?.email ?? '',       [Validators.required, Validators.email]),
      telephone:   new FormControl(this.contact?.telephone ?? '',   [Validators.required]),
      pays:        new FormControl(this.contact?.pays ?? '',        [Validators.required, Validators.minLength(2)]),
      langue:      new FormControl(this.contact?.langue ?? 'FR',   [Validators.required]),
      besoins:     new FormControl(this.contact?.besoins ?? []),   
      commentaire: new FormControl(this.contact?.commentaire ?? ''),
    });

    //  Initialiser la sélection visuelle si on est en mode édition
    this.besoinsSelectionnes = this.contact?.besoins ?? [];
  }

 /**
   * Appelé par le composant enfant `SelectionBesoinsComponent`
   * lorsque l'utilisateur clique sur un besoin.
   * Met à jour la sélection locale et synchronise avec le FormGroup.
   * @param selection - Tableau des besoins sélectionnés.
   */
  onBesoinsChange(selection: string[]): void {
    this.besoinsSelectionnes = selection;
    this.contactForm.get('besoins')?.setValue(selection); // ← sync avec le FormGroup
  }
/**
   * Gère la soumission du formulaire.
   * Si le formulaire est valide, émet l'événement `save` avec les données saisies.
   * Sinon, marque tous les champs comme touchés pour afficher les erreurs de validation.
   */
  handleSubmit(): void {
    if (this.contactForm.valid) {
      this.save.emit(this.contactForm.value as ContactForm);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
/**
   * Gère l'annulation du formulaire.
   * Émet l'événement `cancel` vers le composant parent pour fermer la modale.
   */
 onCancel(): void {
    this.cancel.emit();
  }
}