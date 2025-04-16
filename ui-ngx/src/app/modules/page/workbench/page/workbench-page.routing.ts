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
  {
    title: '测试',
    path: 'upload',
    data: { preload: true, key: 'upload', use: IRouterUse.MENU },
    loadComponent: () =>
      import('./upload-test/upload-test.component').then(
        (m) => m.UploadTestComponent,
      ),
  },
] as Routes;
