import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { IRadioConfig } from '@src/app/shared/models/system.model';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';

interface InputProps extends FormlyFieldProps {
  styles?: Object;
  disabled?: boolean;
  title?: string;
  type?: string;
  radioStyle?: Object;
  options?: Observable<IRadioConfig[]> | IRadioConfig[] | any;
  rows?: number;
}

@Component({
  selector: 'formly-field-grid-radio',
  template: `
    <div [style]="props['styles'] | concatUnits">
      <hs-radio
        [formControl]="formControl"
        [configs]="props.options"
        [rows]="props.rows || 1"
        [style]="props.styles | concatUnits"
        [disabled]="props.disabled || false"
      ></hs-radio>
    </div>
  `,
  imports: [MatInputModule, ReactiveFormsModule, ConcatUnitsPipe, HsRadioComponent],
})
export class FormlyFieldGridRadio extends FieldType<FieldTypeConfig<InputProps>> {}
