import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => {
      return import('./login/login').then((m) => m.Login);
    },
  },
  {
    path: 'register',
    loadComponent: () => {
      return import('./register/register').then((m) => m.Register);
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
