import { Routes } from '@angular/router';
import {WeddingInvitation} from './features/wedding-invitation/wedding-invitation';

export const routes: Routes = [
  {
    path: ':coupleName',
    component: WeddingInvitation
  }
];
