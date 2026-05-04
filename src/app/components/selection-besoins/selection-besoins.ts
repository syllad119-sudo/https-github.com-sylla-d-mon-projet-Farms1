import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
/**
 * Composant de sélection multiple des besoins.
 * Affiche une liste de besoins sous forme de boutons cliquables.
 * Émet la liste des besoins sélectionnés vers le composant parent à chaque changement.
 */

@Component({
  selector: 'app-selection-besoins',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './selection-besoins.html',
  styleUrl: './selection-besoins.scss'
})
export class SelectionBesoinsComponent {

  /** Liste de tous les besoins disponibles à afficher. */

  @Input() items: string[] = [];
    /** Liste des besoins actuellement sélectionnés. */

  @Input() selected: string[] = [];
  /** Événement émis vers le composant parent lorsque la sélection change. */
  @Output() selectedChange = new EventEmitter<string[]>();

  /**
   * Vérifie si un besoin est actuellement sélectionné.
   * @param item - Le besoin à vérifier.
   * @returns `true` si le besoin est sélectionné, `false` sinon.
   */
  isSelected(item: string): boolean {
    return this.selected.includes(item);
  }
/**
   * Ajoute ou retire un besoin de la sélection.
   * Si le besoin est déjà sélectionné, il est retiré.
   * Sinon, il est ajouté à la sélection.
   * Émet la nouvelle sélection vers le composant parent.
   * @param item - Le besoin à ajouter ou retirer.
   */
  toggleItem(item: string): void {
    const index = this.selected.indexOf(item);
    if (index > -1) {
      this.selected = this.selected.filter(i => i !== item);
    } else {
      this.selected = [...this.selected, item];
    }
    this.selectedChange.emit(this.selected);
  }
}