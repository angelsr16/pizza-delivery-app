import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { roleGuard } from './core/guards/role-guard.guard';
import { ROLES } from './core/constants/roles';

const unauthRedirect = () => redirectUnauthorizedTo(['/login']);

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/pages/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, roleGuard],
    data: {
      authGuardPipe: unauthRedirect,
      expectedRoles: [ROLES.INTERNAL_USER],
    },
    loadChildren: () =>
      import('./features/admin/admin.routes').then((r) => r.adminRoutes),
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
