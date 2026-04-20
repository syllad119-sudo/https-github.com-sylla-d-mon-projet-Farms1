import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { Contact } from '../../models/contact.model';
import { ContactForm } from '../../models/contactForm.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KENDO_BUTTONS, KENDO_INPUTS],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss',
})
export class ContactComponent implements OnInit {
  @Input() contact: Contact | null = null;
  @Input() isNew = false;
  @Output() save = new EventEmitter<ContactForm>(); // ← ContactForm
  @Output() cancel = new EventEmitter<void>();

  contactForm!: FormGroup;

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      societe:   new FormControl(this.contact?.societe ?? '',   [Validators.required, Validators.minLength(2)]),
      nom:       new FormControl(this.contact?.nom ?? '',       [Validators.required, Validators.minLength(2)]),
      prenom:    new FormControl(this.contact?.prenom ?? '',    [Validators.required, Validators.minLength(2)]),
      email:     new FormControl('',                            [Validators.required, Validators.email]),
      telephone: new FormControl('',                            [Validators.required]),
      pays:      new FormControl(this.contact?.pays ?? '',      [Validators.required, Validators.minLength(2)]),
      commentaire: new FormControl(''), // Pas de validation pour le commentaire  
    });
  }

  handleSubmit(): void {
    if (this.contactForm.valid) {
      this.save.emit(this.contactForm.value as ContactForm); // ← ContactForm
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}