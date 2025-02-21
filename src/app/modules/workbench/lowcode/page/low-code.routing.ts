import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FolmlyFieldsetWrapperComponent } from '@src/app/modules/formly/folmly-field-fieldset/folmly-fieldset-wrapper.component';
import { FormlyColWrapperComponent } from '@src/app/modules/formly/formly-col-wrapper/formly-col-wrapper.component';
import { FormlyCompWrapperComponent } from '@src/app/modules/formly/formly-comp-wrapper/formly-comp-wrapper.component';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { IRouterUse } from '@src/app/shared/models/route.model';
export function addonsExtension(field: IEditorFormlyField) {
  if (field._design) {
    return;
  }

  if (field.wrappers) {
    if (
      field.wrappers
        .filter((v) => typeof v === 'string')
        .every((v) => (v as string).indexOf('editor') === -1)
    ) {
      field.wrappers.unshift('editor');
    }
  } else {
    field.wrappers = ['editor'];
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
          types: [{ name: 'col', component: FormlyColWrapperComponent }],
          validationMessages: [
            { name: 'required', message: '这个字段是必填的！' },
          ],
          wrappers: [
            { name: 'fieldset', component: FolmlyFieldsetWrapperComponent },
            { name: 'col', component: FormlyColWrapperComponent },
            { name: 'editor', component: FormlyCompWrapperComponent },
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
