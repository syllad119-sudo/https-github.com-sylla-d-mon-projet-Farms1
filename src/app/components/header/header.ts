import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  isOpen = false;
  selectedLang = 'FR';

  flags: { [key: string]: string } = {
    FR: '../../../assets/images/france.png',
    EN: '../../../assets/images/royaume-uni.png',
    ES: '../../../assets/images/drapeau.png',
    PT: '../../../assets/images/bresil.png',
  };

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  selectLang(lang: string) {
    this.selectedLang = lang;
    this.isOpen = false;
  }
}