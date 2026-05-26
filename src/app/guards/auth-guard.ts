import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Vérifie si un token JWT est présent avant d'autoriser l'accès
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  
  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};