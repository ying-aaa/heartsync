import { Routes } from '@angular/router';
import { IRouterUse } from '@src/app/shared/models/route.model';
export default [
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
  },
  {
    title: '预览',
    path: 'preview/:widgetId',
    data: {
      hiddenMenu: true,
    },
    loadComponent: () =>
      import('./widget/widget-preview/widget-preview.component').then(
        (m) => m.WidgetPreviewComponent,
      ),
  },
] as Routes;
