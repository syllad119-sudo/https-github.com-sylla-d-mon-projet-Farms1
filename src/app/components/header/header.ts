import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  /** Indique si le menu déroulant des langues est ouvert ou fermé. */
  isOpen = false;

  /** Code de la langue actuellement sélectionnée. */
  selectedLang = 'FR';

  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  /**
   * Dictionnaire associant chaque code de langue au chemin de son drapeau.
   */
  flags: { [key: string]: string } = {
    FR: 'assets/images/france.png',
    EN: 'assets/images/royaume-uni.png',
    ES: 'assets/images/drapeau.png',
    PT: 'assets/images/bresil.png',
  };

 constructor() {
  this.translate.use('fr');
}

  /**
   * Ouvre ou ferme le menu déroulant des langues.
   */
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Sélectionne une nouvelle langue et met à jour l'interface.
   * @param lang - Le code de la langue sélectionnée (ex: 'FR', 'EN', 'ES', 'PT').
   */
  selectLang(lang: string) {
    this.selectedLang = lang;
    this.translate.use(lang.toLowerCase());
    this.isOpen = false;
    this.cdr.detectChanges();
  }
}