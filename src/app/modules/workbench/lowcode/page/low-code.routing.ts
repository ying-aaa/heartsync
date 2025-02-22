import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { generateUUID } from '@src/app/core/utils';
import { FormlyFieldsetWrapperComponent } from '@src/app/modules/formly/formly-field-fieldset/formly-fieldset-wrapper.component';
import { FormlyColumnWrapperComponent } from '@src/app/modules/formly/formly-column-wrapper/formly-column-wrapper.component';
import { FormlyContorlWrapperComponent } from '@src/app/modules/formly/formly-control-wrapper/formly-control-wrapper.component';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { IRouterUse } from '@src/app/shared/models/route.model';
export function addonsExtension(field: IEditorFormlyField) {
  if (field.type === 'formly-group') {
    field.type = IFieldType.COLUMN;
    return;
  }

  //  || field.type === IFieldType.COLUMN
  // if (field._design) {
  //   return;
  // }

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
      // settings_applications
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
          types: [
            { name: 'column', component: FormlyColumnWrapperComponent },
            { name: 'fieldset', component: FormlyFieldsetWrapperComponent },
          ],
          validationMessages: [
            { name: 'required', message: '这个字段是必填的！' },
          ],
          wrappers: [
            { name: 'contorl', component: FormlyContorlWrapperComponent },
          ],
          extensions: [
            {
              name: 'formly-field-toolbar',
              extension: { onPopulate: addonsExtension },
            },
          ],
        }),
      ),
    ],
    loadComponent: () =>
      import('./widget/widget-editor.component').then(
        (m) => m.WidgetEditorComponent,
      ),
  },
] as Routes;
