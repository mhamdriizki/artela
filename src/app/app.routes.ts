import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Home Page (Landing)
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },

  // 2. Halaman 404 (Not Found) - Opsional jika sudah ada
  // {
  //   path: '404',
  //   loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFound)
  // },

  // 3. Dynamic Invitation Route (/:slug)
  // Ini yang akan menangkap /rizki-pearly dan /pearly-rizki
  {
    path: ':slug',
    loadComponent: () => import('./features/wedding-invitation/wedding-invitation').then(m => m.WeddingInvitation)
  },

  // 4. Wildcard (Redirect ke 404/Home jika route tidak dikenali)
  {
    path: '**',
    redirectTo: ''
  }
];
