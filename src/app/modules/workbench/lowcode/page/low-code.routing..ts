import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
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
      // settings_applications
      icon: 'lens_blur',
    },
    loadComponent: () =>
      import('./dashboard-editor/dashboard-editor.component').then(
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
    providers: [
      importProvidersFrom(
        FormlyModule.forRoot({
          validationMessages: [
            { name: 'required', message: '这个字段是必填的！' },
          ],
        }),
      ),
    ],
    loadComponent: () =>
      import('./widget-editor/widget-editor.component').then(
        (m) => m.WidgetEditorComponent,
      ),
  },
] as Routes;
