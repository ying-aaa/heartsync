import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
import designPageRoutes from './page/design.routing';
export default [
  {
    title: '搭建页',
    path: '',
    data: { preload: true, key: 'design', use: IRouterUse.MENU },
    loadComponent: () =>
      import('./design.component').then((m) => m.DesignComponent),
    children: designPageRoutes,
  },
] as Routes;
