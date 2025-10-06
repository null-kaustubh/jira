import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => {
      return import('./pages/login/login').then((m) => m.Login);
    },
  },
  {
    path: 'register',
    loadComponent: () => {
      return import('./pages/register/register').then((m) => m.Register);
    },
  },
  {
    path: 'projects',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => {
          return import('./dashboard/dashboard').then((m) => m.Dashboard);
        },
      },
    ],
  },
];
