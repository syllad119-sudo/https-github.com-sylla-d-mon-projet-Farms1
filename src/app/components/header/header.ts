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
  isOpen = false;
  selectedLang = 'FR';

  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  flags: { [key: string]: string } = {
  FR: 'assets/images/france.png',
  EN: 'assets/images/royaume-uni.png',
  ES: 'assets/images/drapeau.png',
  PT: 'assets/images/bresil.png',
};

  constructor() {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectLang(lang: string) {
  this.selectedLang = lang;
  this.translate.use(lang.toLowerCase());
  this.isOpen = false;
  this.cdr.detectChanges();
}
}