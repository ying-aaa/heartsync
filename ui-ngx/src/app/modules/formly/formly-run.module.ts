import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { formlyDisplayTypes } from '@src/app/modules/formly/display/formly-display.config';
import { formlyFormTypes } from '@src/app/modules/formly/form/formly-form.config';
import { formlyLayoutTypes } from '@src/app/modules/formly/layout/formly-layout.config';
import { FormlyFieldScroll } from '@src/app/modules/formly/layout/scroll/scroll.type';
import { IEditorFormlyField, IFieldType } from '@src/app/shared/models/public-api';
import { FormlyWrapperLayout } from './layout/layout/layout.wrapper';

export function runExtension(field: IEditorFormlyField) {
  // 关闭设计模式
  field._design = false;

  // 将formly-group类型转换为COLUMN
  if (field.type === 'formly-group') {
    field.type = IFieldType.COLUMN;
  }

  if (field.props?.type === 'number') {
    field.className = field.className
      ? 'mat-field-type-number ' + field.className
      : 'mat-field-type-number ';
  }

  // 为顶级COLUMN字段设置默认样式
  const isColumn = field.type === IFieldType.COLUMN;
  const isTopLevel = !field.parent;
  if (isColumn && isTopLevel) {
    field.props = {
      ...field.props,
      styles: {
        rowGap: 8,
        rowGapUnits: 'px',
        // padding: 16,
        // paddingUnits: 'px',
      },
    };
  }

  // 去掉多余的外层包装
  if (field.wrappers?.length) {
    field.wrappers = field.wrappers.filter(
      (wrapper) => wrapper !== 'contorl' && wrapper !== 'subtableitem',
    );
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
      types: [...formlyLayoutTypes, ...formlyFormTypes, ...formlyDisplayTypes],
      validationMessages: [{ name: 'required', message: '这个字段是必填的！' }],
      wrappers: [
        { name: 'scroll', component: FormlyFieldScroll },
        { name: 'layout', component: FormlyWrapperLayout },
      ],
      extensions: [
        {
          name: 'run',
          extension: { onPopulate: runExtension },
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
export class FormlyRunModule {}
