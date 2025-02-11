import { Route } from '@angular/router';
import homePageRoutes from './page/home-page.routing';

export default [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    title: '首页',
    path: 'home',
    data: { preload: true, key: 'home' },
    loadComponent: () =>
      import('./workbench.component').then((m) => m.WorkbenchComponent),
    children: homePageRoutes,
  },
] as Route[];
