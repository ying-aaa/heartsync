import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'system', pathMatch: 'full' },
  {
    title: '系统管理',
    path: 'system',
    data: { preload: true, key: 'system' },
    loadComponent: () =>
      import('./pages/user-manage/user-manage.component').then(
        (m) => m.UserManageComponent,
      ),
  },
] as Route[];
