import { Route } from '@angular/router';

export default [
  {
    title: '应用',
    path: '',
    data: { preload: true, key: 'run-app' },
    loadComponent: () => import('./run-app.component').then((m) => m.RunAppComponent),
    children: [
      {
        title: '应用',
        path: 'dashboard/:menuId',
        loadComponent: () =>
          import('./dashboard-page/dashboard-page.component').then((m) => m.DashboardPageComponent),
      },
    ],
  },
] as Route[];
