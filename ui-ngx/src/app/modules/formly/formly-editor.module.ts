import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyConfig } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { formlyDisplayTypes } from '@src/app/modules/formly/display/formly-display.config';
import { formlyFormTypes } from '@src/app/modules/formly/form/formly-form.config';
import { formlyLayoutTypes } from '@src/app/modules/formly/layout/formly-layout.config';
import { FormlyFieldScroll } from '@src/app/modules/formly/layout/scroll/scroll.type';
import { IEditorFormlyField, IFieldType } from '@src/app/shared/models/public-api';
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
import { FormlyWrapperLayout } from './layout/layout/layout.wrapper';

export function editorExtension(field: IEditorFormlyField) {
  // 如果是最外层 formly-group，则转为 COLUMN 类型，不再向下走
  if (field.type === 'formly-group') {
    field.type = IFieldType.COLUMN;
    return;
  }

  if (field.props?.type === 'number') {
    field.className = field.className
      ? 'mat-field-type-number ' + field.className
      : 'mat-field-type-number ';
  }

  // 如果是 COLUMN 类型且没有父级且有样式，则设置 rowGap
  if (field.type === IFieldType.COLUMN && !field.parent && field.props?.['styles']) {
    field.props['styles'].rowGap = 8;
    field.props['styles'].rowGapUnits = 'px';
  }

  // 跳过无需处理的情况
  const isColumn = field.type === IFieldType.COLUMN;
  const isGridInFieldset = field.type === 'grid' && field.parent?.type === 'fieldset';
  if (!field._design || isColumn || isGridInFieldset) {
    return;
  }

  // 初始化 wrappers
  field.wrappers = field.wrappers ?? [];

  // 子表添加 subtableitem wrapper
  if (field.parent?.type === IFieldType.SUBTABLE && !field.wrappers.includes('subtableitem')) {
    field.wrappers.unshift('subtableitem');
  }

  // 添加 contorl wrapper
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
        { name: 'layout', component: FormlyWrapperLayout },
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
