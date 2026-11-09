import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Shell } from './shared/components/shell/shell';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'logout',
        loadComponent: () => import('./pages/logout/logout').then((m) => m.Logout),
      },
      {
        path: 'lancamentos',
        loadComponent: () =>
          import('./pages/lancamentos/lancamentos').then((m) => m.Lancamentos),
      },
      {
        path: 'viagens',
        loadComponent: () =>
          import('./pages/viagens/viagens').then((m) => m.Viagens),
      },
      {
        path: 'resumo-mensal',
        loadComponent: () =>
          import('./pages/resumo-mensal/resumo-mensal').then((m) => m.ResumoMensal),
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./pages/configuracoes/configuracoes').then((m) => m.Configuracoes),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
