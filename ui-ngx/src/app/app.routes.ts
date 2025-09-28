import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/page/page-not-found/page-not-found.component';

export const routes: Routes = [
  //   { path: "self", redirectTo: "/login/login-form", pathMatch: "full" },
  {
    path: '',
    data: { preload: true },
    loadChildren: () => import('./test/test.routing'),
  },
  {
    path: 'workbench',
    data: { preload: true },
    loadChildren: () => import('./modules/page/workbench/workbench.routing'),
  },
  {
    path: 'design/:appId',
    data: { preload: true },
    loadChildren: () => import('./modules/page/design/design.routing'),
  },
  {
    path: 'run-app/:appId',
    data: { preload: true },
    loadChildren: () => import('./modules/page/run-app/run-app.routing'),
  },
  {
    path: 'login',
    data: { preload: true },
    loadChildren: () => import('./modules/page/login/login.routing'),
  },
  { path: '**', component: PageNotFoundComponent },
];
