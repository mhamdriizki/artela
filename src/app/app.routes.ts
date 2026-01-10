import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then((m) => m.Home),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import(
        './features/wedding-invitation/wedding-invitation'
      ).then((m) => m.WeddingInvitation),
  },
];

