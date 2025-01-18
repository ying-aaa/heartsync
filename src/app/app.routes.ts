import { Routes } from '@angular/router';

export const routes: Routes = [
  //   { path: "self", redirectTo: "/login/login-form", pathMatch: "full" },
  {
    path: '',
    data: { preload: true },
    loadChildren: () => import('./modules/home/home-routing.modules'),
  },
];
