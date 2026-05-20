import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Contacts } from './pages/contacts/contacts';
import { ContactComponent } from './components/contact-modal/contact-modal';
import { authGuard } from './guards/auth-guard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'contacts', component: Contacts , canActivate: [authGuard]},
  { path: 'contact', component: ContactComponent },
];
