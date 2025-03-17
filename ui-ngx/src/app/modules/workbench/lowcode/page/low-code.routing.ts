import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyContorlWrapperComponent } from '@src/app/modules/formly/layout/control/formly-control-wrapper.component';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';
import { IRouterUse } from '@src/app/shared/models/route.model';
import { FormlyFieldScrollComponent } from '@src/app/modules/formly/layout/scroll/formly-field-scroll.component';
import { formlyLayoutTypes } from '@src/app/modules/formly/layout/formly-layout-types';
import { formlyFormTypes } from '@src/app/modules/formly/form/formly-form-types';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MonacoEditorModule,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { HIGHLIGHT_OPTIONS, provideHighlightOptions } from 'ngx-highlightjs';
import { formlyDisplayTypes } from '@src/app/modules/formly/display/formly-display-types';
import { FormlyFieldSubTableItemComponent } from '@src/app/modules/formly/layout/subtable-item/formly-field-subtable-item.component';

export function editorExtension(field: IEditorFormlyField) {
  // 最外层列
  if (field.type === 'formly-group') {
    field.type = IFieldType.COLUMN;
    return;
  }

  if (field.type === IFieldType.COLUMN) {
    if (!field.parent && field.props?.['styles']) {
      field.props!['styles']!.rowGap = 8;
    }
  }

  if (
    !field._design ||
    // 列配置
    field.type === IFieldType.COLUMN ||
    // (field.parent?.type === IFieldType.COLUMN && field.parent?.parent) ||
    // 群组套山歌配置
    (field.type === 'grid' && field.parent?.type === 'fieldset')
  )
    return;

  if (!field.wrappers) field.wrappers = [];

  // 子表添加 tableitem
  if (field.parent?.type === IFieldType.SUBTABLE) {
    if (!field.wrappers.includes('subtableitem')) {
      field.wrappers.unshift('subtableitem');
    }
  }

  if (!field.wrappers.includes('contorl')) {
    field.wrappers.unshift('contorl');
  }
}

export function previewExtension(field: IEditorFormlyField) {
  field._design = false;

  if (field.type === 'formly-group') {
    field.type = IFieldType.COLUMN;
  }

  if (field.wrappers) {
    field.wrappers = field.wrappers.filter(
      (wrapper) => wrapper !== 'contorl' && wrapper !== 'subtableitem',
    );
  }
}
// const monacoConfig: NgxMonacoEditorConfig = {
//   baseUrl: window.location.origin + '/assets/monaco/min/vs',
//   defaultOptions: { scrollBeyondLastLine: false }, // 默认编辑器选项
//   onMonacoLoad: () => {
//     console.log((window as any).monaco);
//   }, // Monaco 加载完成后的回调
// };
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
          types: [
            ...formlyFormTypes,
            ...formlyLayoutTypes,
            ...formlyDisplayTypes,
          ],
          validationMessages: [
            { name: 'required', message: '这个字段是必填的！' },
          ],
          wrappers: [
            { name: 'contorl', component: FormlyContorlWrapperComponent },
            { name: 'scroll', component: FormlyFieldScrollComponent },
            {
              name: 'subtableitem',
              component: FormlyFieldSubTableItemComponent,
            },
          ],
          extensions: [
            {
              name: 'formly-field-toolbar',
              extension: { onPopulate: editorExtension },
            },
          ],
          extras: {
            resetFieldOnHide: false,
          },
        }),
        // MonacoEditorModule.forRoot(monacoConfig), // use forRoot() in main app module only.
      ),
      { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    ],
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
    providers: [
      importProvidersFrom(
        FormlyModule.forRoot({
          types: [
            ...formlyLayoutTypes,
            ...formlyFormTypes,
            ...formlyDisplayTypes,
          ],
          validationMessages: [
            { name: 'required', message: '这个字段是必填的！' },
          ],
          wrappers: [{ name: 'scroll', component: FormlyFieldScrollComponent }],
          extensions: [
            {
              name: 'formly-field-toolbar',
              extension: { onPopulate: previewExtension },
            },
          ],
          extras: {
            resetFieldOnHide: false,
          },
        }),
      ),
      { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    ],
    loadComponent: () =>
      import('./widget/widget-preview/widget-preview.component').then(
        (m) => m.WidgetPreviewComponent,
      ),
  },
] as Routes;
