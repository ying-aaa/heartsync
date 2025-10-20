import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'data-source', pathMatch: 'full' },
  {
    title: '数据源管理',
    path: 'data-source',
    data: { icon: 'user' },
    loadComponent: () =>
      import('./data/data-source/data-source.component').then((m) => m.DataSourceComponent),
  },
  {
    title: '数据资产管理',
    path: 'data-asset',
    data: { icon: 'user' },
    loadComponent: () =>
      import('./data/data-asset/data-asset.component').then((m) => m.DataAssetComponent),
  },
] as Route[];
