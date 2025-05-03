import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    title: '仪表版资源',
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard-manage.component').then(
        (m) => m.DashboardManageComponent,
      ),
  },
  {
    title: '仪表板设计',
    path: 'layout',
    loadComponent: () =>
      import('./dashboard/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
  },
] as Routes;
