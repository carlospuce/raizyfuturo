import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full'
  },
  {
    path: 'principal',
    loadComponent: () => import('./paginas/principal/principal')
      .then(m => m.Principal)
  }
  // Aquí después añadirás más rutas
];