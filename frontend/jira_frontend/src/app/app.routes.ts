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
            path: '',
            pathMatch: 'full',
            redirectTo: 'summary', // default redirect to summary
          },
          {
            path: 'summary',
            loadComponent: () =>
              import('./pages/project-summary/project-summary').then((m) => m.ProjectSummary),
          },
          {
            path: 'boards',
            loadComponent: () =>
              import('./components/kanban-board/kanban-board').then((m) => m.KanbanBoard),
          },
          {
            path: 'forms',
            loadComponent: () =>
              import('./pages/project-forms/project-forms').then((m) => m.ProjectForms),
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./pages/project-list/project-list').then((m) => m.ProjectList),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
