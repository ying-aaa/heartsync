import { Route } from '@angular/router';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';

export default [
  {
    title: '应用',
    path: '',
    data: { preload: true, key: 'run-app' },
    loadComponent: () => import('./run-app.component').then((m) => m.RunAppComponent),
    providers: [RunAppMenuService, RunAppDesignService, RunAppGlobalService],
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
