import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
import configurationRoutes from './configuration.routing';
import dashboardRoutes from './dashboard.routing';
import widgetRoutes from './widget.routing';

const designPageRoutes = [
  { path: '', redirectTo: 'configuration', pathMatch: 'full' },
  {
    title: '应用配置',
    path: 'configuration',
    data: {
      preload: true,
      key: 'configuration',
      use: IRouterUse.MENU,
      icon: 'app_registration',
    },
    loadComponent: () =>
      import('./configuration/configuration-editor.component').then(
        (m) => m.ConfigurationEditorComponent
      ),
    children: configurationRoutes,
  },
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
    children: dashboardRoutes,
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
