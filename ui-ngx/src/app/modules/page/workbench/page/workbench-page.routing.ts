import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';

export default [
  // { path: '', redirectTo: 'workbench', pathMatch: 'full' },
  {
    title: '我的应用',
    path: '',
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
  {
    title: '记录',
    path: 'record',
    data: { preload: true, key: 'record', use: IRouterUse.MENU },
    loadComponent: () =>
      import('./self-record/self-record.component').then(
        (m) => m.SelfRecordComponent,
      ),
  },
] as Routes;
