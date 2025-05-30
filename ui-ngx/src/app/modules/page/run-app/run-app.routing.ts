import { Route } from '@angular/router';


export default [
  {
    title: '应用',
    path: '',
    data: { preload: true, key: 'run-app' },
    loadComponent: () =>
      import('./run-app.component').then((m) => m.RunAppComponent),
    children: [],
  },
] as Route[];
