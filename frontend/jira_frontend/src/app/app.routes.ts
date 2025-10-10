import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/dashboard/dashboard';
import { AuthGuard } from './services/auth.guard'; 

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'users',
        children :[
          {
            path : '',
            loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent),
          },
          {
            path: 'register',
            loadComponent: () => import('./pages/register/register').then((m) => m.Register),
          },
        ]
      },
      {
        path: 'projects/:id',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'boards' },
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
            path: 'employees',
            loadComponent: () =>
              import('./pages/employees/employees').then((m) => m.Employees),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
