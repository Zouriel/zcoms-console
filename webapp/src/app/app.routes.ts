import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contacts' },
  { path: 'contacts', loadComponent: () => import('./pages/contacts').then((m) => m.ContactsPage) },
  { path: 'workspaces', loadComponent: () => import('./pages/workspaces').then((m) => m.WorkspacesPage) },
  { path: 'sessions', loadComponent: () => import('./pages/sessions').then((m) => m.SessionsPage) },
  { path: 'personas', loadComponent: () => import('./pages/personas').then((m) => m.PersonasPage) },
  { path: 'allowlist', loadComponent: () => import('./pages/allowlist').then((m) => m.AllowlistPage) },
  { path: 'connectors', loadComponent: () => import('./pages/connectors').then((m) => m.ConnectorsPage) },
  { path: 'groups', loadComponent: () => import('./pages/groups').then((m) => m.GroupsPage) },
  { path: 'projects', loadComponent: () => import('./pages/projects').then((m) => m.ProjectsPage) },
  { path: 'triage', loadComponent: () => import('./pages/triage').then((m) => m.TriagePage) },
  { path: 'reminders', loadComponent: () => import('./pages/reminders').then((m) => m.RemindersPage) },
  { path: 'errands', loadComponent: () => import('./pages/errands').then((m) => m.ErrandsPage) },
  { path: 'morning', loadComponent: () => import('./pages/morning').then((m) => m.MorningPage) },
  { path: 'messages', loadComponent: () => import('./pages/messages').then((m) => m.MessagesPage) },
  { path: 'commerce', loadComponent: () => import('./pages/commerce').then((m) => m.CommercePage) },
  { path: 'settings', loadComponent: () => import('./pages/settings').then((m) => m.SettingsPage) },
  { path: '**', redirectTo: 'contacts' },
];
