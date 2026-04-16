import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Contacts } from './pages/contacts/contacts';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'contacts', component: Contacts },
];
