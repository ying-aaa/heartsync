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

export function runExtension(field: IEditorFormlyField) {
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

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [...formlyLayoutTypes, ...formlyFormTypes, ...formlyDisplayTypes],
      validationMessages: [{ name: 'required', message: '这个字段是必填的！' }],
      wrappers: [{ name: 'scroll', component: FormlyFieldScrollComponent }],
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
  exports: [FormlyModule, FormlyMaterialModule],
})
export class FormlyRunModule {}
