import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
import configurationRoutes from './app.routing';
import dashboardRoutes from './dashboard.routing';
import widgetRoutes from './widget.routing';
import dataAssetRoutes from './data.routing';

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
      import('./app/app-design-router.component').then(
        (m) => m.AppDesignRouterComponent,
      ),
    children: configurationRoutes,
  },
  {
    title: '数据资产',
    path: 'data',
    data: {
      preload: true,
      key: 'data',
      use: IRouterUse.MENU,
      icon: 'storage',
    },
    loadComponent: () => import('./data/data-design-router.component').then((m) => m.DataAssetDesignRouterComponent),
    children: dataAssetRoutes,
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
      import('./dashboard/dashboard-design-router.component').then((m) => m.DashboardDesignRouterComponent),
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
      import('./widget/widget-design-router.component').then((m) => m.WidgetDesignRouterComponent),
    children: widgetRoutes,
  },
  // 测试页
  {
    title: '测试',
    path: 'test',
    loadComponent: () => import('./test/multi-layer.component').then((m) => m.MultiLayerComponent),
  },
];

export default [
  {
    title: '设计页',
    path: '',
    data: { preload: true, key: 'design', use: IRouterUse.MENU },
    loadComponent: () => import('./design.component').then((m) => m.DesignComponent),
    children: designPageRoutes,
  },
] as Routes;
