import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selection-besoins',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selection-besoins.html',
  styleUrl: './selection-besoins.scss'
})
export class SelectionBesoinsComponent {

  @Input() items: string[] = [];
  @Input() selected: string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  isSelected(item: string): boolean {
    return this.selected.includes(item);
  }

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