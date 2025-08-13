import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
import systemPages from './system/pages/system-page.routing';
import { OverseasGuard } from '@src/app/core/guards/overseas.guard';

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
    title: '系统管理',
    path: 'system',
    data: { preload: true, key: 'system', use: IRouterUse.MENU },
    loadComponent: () =>
      import('./system/system-manage.component').then(
        (m) => m.SystemManageComponent,
      ),
    children: systemPages,
  },
  {
    title: '记录',
    path: 'record',
    data: {
      // preload: true, key: 'record', use: IRouterUse.MENU
    },
    canActivate: [OverseasGuard],
    loadComponent: () =>
      import('./self-record/self-record.component').then(
        (m) => m.SelfRecordComponent,
      ),
  },
] as Routes;
