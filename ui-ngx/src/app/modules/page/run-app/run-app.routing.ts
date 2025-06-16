import { Route } from '@angular/router';

export default [
  {
    title: '应用',
    path: '',
    data: { preload: true, key: 'run-app' },
    loadComponent: () =>
      import('./run-app.component').then((m) => m.RunAppComponent),
    children: [
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        title: '应用',
        path: 'dashboard/:dashboardId',
        pathMatch: 'full',
        loadComponent: () =>
          import('./dashboard-page/dashboard-page.component').then(
            (m) => m.DashboardPageComponent,
          ),
      },
    ],
  },
] as Route[];
