import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyConfig } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { formlyDisplayTypes } from '@src/app/modules/formly/display/formly-display-types';
import { formlyFormTypes } from '@src/app/modules/formly/form/formly-form-types';
import { formlyLayoutTypes } from '@src/app/modules/formly/layout/formly-layout-types';
import { FormlyFieldScrollComponent } from '@src/app/modules/formly/layout/scroll/formly-field-scroll.component';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/public-api';
import { FormlyContorlWrapperComponent } from './layout/control/formly-control-wrapper.component';
import { FormlyFieldSubTableItemComponent } from './layout/subtable-item/formly-field-subtable-item.component';

export function editorExtension(field: IEditorFormlyField) {
  console.log('%c Line:17 🍑', 'color:#e41a6a', field);
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
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [...formlyFormTypes, ...formlyLayoutTypes, ...formlyDisplayTypes],
      validationMessages: [{ name: 'required', message: '这个字段是必填的！' }],
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
