import { Routes } from '@angular/router';

export default [
  {
    title: '应用配置',
    path: '',
    loadComponent: () =>
      import('./configuration/configuration-manage/configuration-manage.component').then(
        (m) => m.ConfigurationManageComponent,
      ),
  },
] as Routes;
