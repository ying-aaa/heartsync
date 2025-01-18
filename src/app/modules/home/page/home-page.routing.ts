import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';

export default [
  { path: '', redirectTo: 'workbench', pathMatch: 'full' },
  {
    title: '我的应用',
    path: 'workbench',
    data: { preload: true, key: 'workbench', use: IRouterUse.MENU },
    loadComponent: () =>
      import('./app-workbench/app-workbench.component').then(
        (m) => m.AppWorkbenchComponent,
      ),
  },
  {
    title: '应用管理',
    path: 'manage',
    data: { preload: true, key: 'manage', use: IRouterUse.MENU },
    loadComponent: () =>
      import('./app-manage/app-manage.component').then(
        (m) => m.AppManageComponent,
      ),
  },
] as Routes;
