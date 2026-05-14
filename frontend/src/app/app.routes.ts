import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'select-company', pathMatch: 'full' },
  { path: 'select-company', loadComponent: () => import('./components/auth/company-selection/company-selection').then(m => m.CompanySelection) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login').then(m => m.Login) },
  
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'agenda', loadComponent: () => import('./components/agenda/agenda-global/agenda-global.component').then(m => m.AgendaGlobalComponent) },
      { path: 'pacientes', loadComponent: () => import('./components/pacientes/pacientes-list').then(m => m.PacientesList) },
      { path: 'pacientes/nuevo', loadComponent: () => import('./components/pacientes/paciente-form/paciente-form').then(m => m.PacienteForm) },
      { 
        path: 'pacientes/:id/:representado', 
        loadComponent: () => import('./components/pacientes/paciente-dashboard/paciente-dashboard').then(m => m.PacienteDashboard),
        children: [
          { path: '', redirectTo: 'perfil', pathMatch: 'full' },
          { path: 'perfil', loadComponent: () => import('./components/pacientes/paciente-form/paciente-form').then(m => m.PacienteForm) },
          { path: 'citas', loadComponent: () => import('./components/pacientes/paciente-citas/paciente-citas.component').then(m => m.PacienteCitasComponent) },
          { path: 'tratamientos', loadComponent: () => import('./components/pacientes/paciente-tratamientos/paciente-tratamientos').then(m => m.PacienteTratamientosComponent) }
        ]
      }
    ]
  }
];
