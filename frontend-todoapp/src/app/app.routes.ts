import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect to login by default
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  
  // Login route
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  
  // Dashboard route
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  
  // Tasks route
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  
  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/login'
  }
];
