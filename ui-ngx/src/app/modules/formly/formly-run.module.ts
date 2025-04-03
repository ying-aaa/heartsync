import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormlyModule, FormlyConfig } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatSliderModule } from '@ngx-formly/material/slider';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
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

  if (field.type === IFieldType.COLUMN) {
    if (!field.parent) {
      field.props!['styles'] = {
        rowGap: 8,
        rowGapUnits: 'px',
      };
    }
  }

  if (field.wrappers) {
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
  exports: [FormlyModule],
})
export class FormlyRunModule {}
