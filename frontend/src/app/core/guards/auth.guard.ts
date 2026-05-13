import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificamos si existe el token en localStorage
  const token = localStorage.getItem('token');
  
  const selectedCompany = localStorage.getItem('selectedCompany');

  if (token && selectedCompany) {
    return true; // Acceso permitido
  }

  if (!selectedCompany) {
    router.navigate(['/select-company']);
  } else {
    router.navigate(['/login']);
  }

  return false;
};
