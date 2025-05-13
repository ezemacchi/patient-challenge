import { Routes } from '@angular/router';

// Application routes
export const routes: Routes = [
  {
    path: 'patients',
    loadChildren: () => import('./features/patients/patients.routes').then(m => m.PATIENTS_ROUTES) // Load patient routes
  },
  {
    path: '',
    redirectTo: '/patients', // Default route redirects to patients list
    pathMatch: 'full'
  },
  {
    path: '**', // Wildcard route for a 404 page (optional)
    redirectTo: '/patients' // Or redirect to home
    // component: NotFoundComponent // Example: You could create a NotFoundComponent
  }
];
