import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/page/page-not-found/page-not-found.component';

export const routes: Routes = [
  //   { path: "self", redirectTo: "/login/login-form", pathMatch: "full" },
  {
    path: '',
    data: { preload: true },
    loadChildren: () => import('./modules/page/workbench/workbench.routing'),
  },
  {
    path: 'design',
    data: { preload: true },
    loadChildren: () => import('./modules/page/design/design.routing'),
  },
  { path: '**', component: PageNotFoundComponent },
];
