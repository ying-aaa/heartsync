import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyConfig } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { formlyDisplayTypes } from '@src/app/modules/formly/display/formly-display.config';
import { formlyFormTypes } from '@src/app/modules/formly/form/formly-form.config';
import { formlyLayoutTypes } from '@src/app/modules/formly/layout/formly-layout.config';
import { FormlyFieldScroll } from '@src/app/modules/formly/layout/scroll/scroll.type';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/public-api';
import { FormlyWrapperContorl } from './layout/control/control.wrapper';
import { FormlyFieldSubTableItem } from './layout/subtable-item/subtable-item.type';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';

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
    // 群组套栅格配置
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

@NgModule({
  imports: [
    MatNativeDateModule,
    FormlyMatDatepickerModule,
    FormlyMatToggleModule,
    FormlyMatSliderModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    FormlyModule.forRoot({
      types: [...formlyFormTypes, ...formlyLayoutTypes, ...formlyDisplayTypes],
      validationMessages: [{ name: 'required', message: '这个字段是必填的！' }],
      wrappers: [
        { name: 'contorl', component: FormlyWrapperContorl },
        { name: 'scroll', component: FormlyFieldScroll },
        {
          name: 'subtableitem',
          component: FormlyFieldSubTableItem,
        },
      ],
      extensions: [
        {
          name: 'editor',
          extension: { onPopulate: editorExtension },
        },
      ],
      extras: {
        resetFieldOnHide: false,
      },
    }),
    FormlyMaterialModule,
  ],
  exports: [FormlyModule],
})
export class FormlyEditorModule {}
