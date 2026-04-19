import { Component } from '@angular/core';
import {
  KENDO_GRID,
  EditEvent,
  RemoveEvent,
  SaveEvent,
  CancelEvent,
} from '@progress/kendo-angular-grid';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import CONTACTS from '../../../assets/contact.json';
import { pencilIcon, trashIcon, SVGIcon } from '@progress/kendo-svg-icons';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    KENDO_GRID,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KENDO_DIALOGS,
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  editIcon: SVGIcon = pencilIcon;
  deleteIcon: SVGIcon = trashIcon;

  contacts: Contact[] = [...CONTACTS];
  editedRowIndex: number | undefined;
  editedFormGroup: FormGroup | undefined;

  isDialogOpen = false;
  selectedContact: Contact | null = null;
  isNewContact = false;

  createFormGroup(dataItem: Contact): FormGroup {
    return new FormGroup({
      id: new FormControl(dataItem.id),
      societe: new FormControl(dataItem.societe),
      nom: new FormControl(dataItem.nom),
      prenom: new FormControl(dataItem.prenom),
      pays: new FormControl(dataItem.pays),
    });
  }

  openAddDialog(): void {
    this.selectedContact = null;
    this.isNewContact = true;
    this.isDialogOpen = true;
  }

  onContactSaved(contact: Contact): void {
    this.contacts = [contact, ...this.contacts];
    this.isDialogOpen = false;
  }

  onDialogCancel(): void {
    this.isDialogOpen = false;
  }

  editHandler(event: EditEvent): void {
    this.closeEditor(event.sender);
    this.editedRowIndex = event.rowIndex;
    this.editedFormGroup = this.createFormGroup(event.dataItem);
    event.sender.editRow(event.rowIndex, this.editedFormGroup);
  }

  cancelHandler(event: CancelEvent): void {
    this.closeEditor(event.sender, event.rowIndex);
  }

  saveHandler(event: SaveEvent): void {
    if (event.formGroup.valid) {
      Object.assign(this.contacts[event.rowIndex], event.formGroup.value);
      this.contacts = [...this.contacts];
    }
    event.sender.closeRow(event.rowIndex);
    this.editedRowIndex = undefined;
    this.editedFormGroup = undefined;
  }

  removeHandler(event: RemoveEvent): void {
    this.contacts = this.contacts.filter((_, i) => i !== event.rowIndex);
  }

  private closeEditor(grid: any, rowIndex = this.editedRowIndex): void {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
    }
    this.editedRowIndex = undefined;
    this.editedFormGroup = undefined;
  }
}