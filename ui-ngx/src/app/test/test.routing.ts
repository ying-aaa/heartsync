import { Route } from '@angular/router';
import { IRouterUse } from '../shared/models/route.model';
export default [
  { path: '', redirectTo: 'test', pathMatch: 'full' },
  {
    title: '测试',
    path: 'test',
    data: { preload: true, key: 'test' },
    loadComponent: () =>
      import('./test.component').then((m) => m.TestComponent),
    children: [
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
      {
        path: 'upload',
        title: '上传',
        data: { preload: true, key: 'upload', use: IRouterUse.MENU },
        loadComponent: () =>
          import('./upload/upload.component').then((m) => m.UploadComponent),
      },
    ],
  },
] as Route[];
