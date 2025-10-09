import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/dashboard/dashboard';
import { AuthGuard } from './services/auth.guard'; // ✅ import

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [AuthGuard], // ✅ Add this line
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard], // ✅ protect default route
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
