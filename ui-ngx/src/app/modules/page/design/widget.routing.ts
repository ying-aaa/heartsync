import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'resource', pathMatch: 'full' },
  {
    title: '部件资源',
    path: 'resource',
    loadComponent: () =>
      import('./widget/widget-manage.component').then(
        (m) => m.WidgetManageComponent,
      ),
  },
  {
    title: '表单',
    path: 'form',
    data: { widgetType: true },
    loadComponent: () =>
      import('./widget/design/form/form-design.component').then(
        (m) => m.FormDesignComponent,
      ),
  },
  {
    title: '列表',
    path: 'list',
    data: { widgetType: true },
    loadComponent: () =>
      import('./widget/design/list/list-design.component').then(
        (m) => m.ListDesignComponent,
      ),
  },
  {
    title: '详情',
    path: 'detail',
    data: { widgetType: true },
    loadComponent: () =>
      import('./widget/design/detail/detail-design.component').then(
        (m) => m.DetailDesignComponent,
      ),
  },
  {
    title: '代码',
    path: 'code',
    data: { widgetType: true },
    loadComponent: () =>
      import('./widget/design/code/code-design.component').then(
        (m) => m.CodeDesignComponent,
      ),
  },
  {
    title: '图表',
    path: 'chart',
    data: {},
    loadComponent: () =>
      import('./widget/design/chart/chart-design.component').then(
        (m) => m.ChartDesignComponent,
      ),
  },
  {
    title: 'cesium',
    path: 'cesium',
    data: { widgetType: true },
    loadComponent: () =>
      import('./widget/design/cesium/cesium-design.component').then(
        (m) => m.CesiumDesignComponent,
      ),
  },
  {
    title: 'x6',
    path: 'x6',
    data: { widgetType: true },
    loadComponent: () =>
      import('./widget/design/x6/x6-design.component').then(
        (m) => m.X6DesignComponent,
      ),
  },
] as Routes;
