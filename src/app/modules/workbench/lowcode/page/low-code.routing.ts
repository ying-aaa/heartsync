import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyContorlWrapperComponent } from '@src/app/modules/formly/layout/control/formly-control-wrapper.component';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { IRouterUse } from '@src/app/shared/models/route.model';
import { FormlyFieldScrollComponent } from '@src/app/modules/formly/layout/scroll/formly-field-scroll.component';
import { formlyLayoutTypes } from '@src/app/modules/formly/layout/formly-layout-types';
import { formlyFormTypes } from '@src/app/modules/formly/form/formly-form-types';
import { MAT_DATE_LOCALE } from '@angular/material/core';
export function addonsExtension(field: IEditorFormlyField) {
  if (field.type === 'formly-group') {
    field.type = IFieldType.COLUMN;
    return;
  }
  // field.type === IFieldType.COLUMN
  if (!field._design || field.type === IFieldType.COLUMN) return;

  if (field.wrappers) {
    if (
      field.wrappers
        .filter((v) => typeof v === 'string')
        .every((v) => (v as string).indexOf('contorl') === -1)
    ) {
      field.wrappers.unshift('contorl');
    }
  } else {
    field.wrappers = ['contorl'];
  }
}

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
    providers: [
      importProvidersFrom(
        FormlyModule.forRoot({
          types: [...formlyLayoutTypes, ...formlyFormTypes],
          validationMessages: [
            { name: 'required', message: '这个字段是必填的！' },
          ],
          wrappers: [
            { name: 'contorl', component: FormlyContorlWrapperComponent },
            { name: 'scroll', component: FormlyFieldScrollComponent },
          ],
          extensions: [
            {
              name: 'formly-field-toolbar',
              extension: { onPopulate: addonsExtension },
            },
          ],
        }),
      ),
      { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    ],
    loadComponent: () =>
      import('./widget/widget-editor.component').then(
        (m) => m.WidgetEditorComponent,
      ),
  },
] as Routes;
