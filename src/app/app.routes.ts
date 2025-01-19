import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/common/page-not-found/page-not-found.component';

export const routes: Routes = [
  //   { path: "self", redirectTo: "/login/login-form", pathMatch: "full" },
  {
    path: '',
    data: { preload: true },
    loadChildren: () => import('./modules/home/home-routing.modules'),
  },
  { path: '**', component: PageNotFoundComponent },
];
