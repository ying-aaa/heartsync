import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
import widgetRoutes from './widget.routing';

const designPageRoutes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    title: '仪表版',
    path: 'dashboard',
    data: {
      preload: true,
      key: 'dashboard',
      use: IRouterUse.MENU,
      icon: 'lens_blur',
    },
    loadComponent: () =>
      import('./dashboard/dashboard-editor.component').then(
        (m) => m.DashboardEditorComponent,
      ),
  },
  {
    title: '部件',
    path: 'widget',
    data: {
      preload: true,
      key: 'widget',
      use: IRouterUse.MENU,
      icon: 'send_time_extension',
    },
    loadComponent: () =>
      import('./widget/widget-editor.component').then(
        (m) => m.WidgetEditorComponent,
      ),
    children: widgetRoutes,
  },
];

export default [
  {
    title: '搭建页',
    path: '',
    data: { preload: true, key: 'design', use: IRouterUse.MENU },
    loadComponent: () =>
      import('./design.component').then((m) => m.DesignComponent),
    children: designPageRoutes,
  },
] as Routes;
