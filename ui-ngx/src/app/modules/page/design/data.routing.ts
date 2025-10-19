import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'data-source', pathMatch: 'full' },
  {
    title: '数据源',
    path: 'data-source',
    loadComponent: () =>
      import('./data/data-source/data-source.component').then((m) => m.DataSourceComponent),
  },
] as Routes;
