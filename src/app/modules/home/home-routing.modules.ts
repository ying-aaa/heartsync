import { Route } from '@angular/router';
import homePageRoutes from './page/home-page.routing';

export default [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    title: '首页',
    path: 'home',
    data: { preload: true, key: 'home' },
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
    children: homePageRoutes,
  },
] as Route[];
