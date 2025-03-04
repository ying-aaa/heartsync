import { Route } from '@angular/router';
import WorkbenchPageRoutes from './home/workbench-page.routing';

export default [
  { path: '', redirectTo: 'workbench', pathMatch: 'full' },
  {
    title: '工作台',
    path: 'workbench',
    data: { preload: true, key: 'workbench' },
    loadComponent: () =>
      import('./workbench.component').then((m) => m.WorkbenchComponent),
    children: WorkbenchPageRoutes,
  },
] as Route[];
