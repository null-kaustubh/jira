import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'projects/:id',
        children: [
          {
            path: 'boards',
            loadComponent: () => {
              return import('./components/kanban-board/kanban-board').then((m) => m.KanbanBoard);
            },
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
