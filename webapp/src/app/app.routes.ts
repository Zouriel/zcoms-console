import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contacts' },
  { path: 'contacts', loadComponent: () => import('./pages/contacts').then((m) => m.ContactsPage) },
  { path: 'workspaces', loadComponent: () => import('./pages/workspaces').then((m) => m.WorkspacesPage) },
  { path: 'sessions', loadComponent: () => import('./pages/sessions').then((m) => m.SessionsPage) },
  { path: 'personas', loadComponent: () => import('./pages/personas').then((m) => m.PersonasPage) },
  { path: 'allowlist', loadComponent: () => import('./pages/allowlist').then((m) => m.AllowlistPage) },
  { path: 'commerce', loadComponent: () => import('./pages/commerce').then((m) => m.CommercePage) },
  { path: 'settings', loadComponent: () => import('./pages/settings').then((m) => m.SettingsPage) },
  { path: '**', redirectTo: 'contacts' },
];
