import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
import lowCodePageRoutes from './page/low-code.routing';

export default [
  // { path: '', redirectTo: 'lowcode', pathMatch: 'full' },
  {
    title: '搭建页',
    path: '',
    data: { preload: true, key: 'lowcode', use: IRouterUse.MENU },
    loadComponent: () =>
      import('./lowcode.component').then((m) => m.LowcodeComponent),
    children: lowCodePageRoutes,
  },
] as Routes;
