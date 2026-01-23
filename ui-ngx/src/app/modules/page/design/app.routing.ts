import { Routes } from '@angular/router';

export default [
  {
    title: '应用配置',
    path: '',
    loadComponent: () =>
      import('./app/app-design-manage/app-design-manage.component').then(
        (m) => m.AppDesignManageComponent,
      ),
  },
] as Routes;
