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
  },
  {
    path: 'eleccion',
    loadComponent: () => import('./paginas/eleccion/eleccion')
      .then(m => m.Eleccion)
  },
  {
    path: 'preguntas',
    loadComponent: () => import('./paginas/preguntas/preguntas')
      .then(m => m.Preguntas)
  },
  {
    path: 'resultados',
    loadComponent: () => import('./paginas/resultados/resultados')
      .then(m => m.Resultados)
  },
  {
    path: 'ia',
    loadComponent: () => import('./paginas/ia/ia')
      .then(m => m.Ia)
  }
  // Aquí después añadirás más rutas
];