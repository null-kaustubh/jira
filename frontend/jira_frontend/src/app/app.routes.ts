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

  // Parent route that uses the layout for all its children
  {
    path: '', // This will now handle routes like '/dashboard', '/users'
    component: MainLayoutComponent,
    // canActivate: [AuthGuard], // You can add a guard here later
    children: [
      {
        path: 'dashboard',
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
      // ... add other child routes like 'projects' here
    ],
  },

  // Redirect the root path to the login page
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Wildcard route for any other URL
  { path: '**', redirectTo: '/login' },
];
