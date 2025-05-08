import { Route } from '@angular/router';

export default [
  {
    title: '登录',
    path: '',
    data: { preload: true, key: 'login' },
    loadComponent: () =>
      import('./pages/login.component').then((m) => m.LoginComponent),
  },
] as Route[];
