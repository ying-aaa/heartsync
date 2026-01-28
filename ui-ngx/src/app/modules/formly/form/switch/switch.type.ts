import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import {
  SwitchComponent,
  ISwitchCustomValues,
} from '@src/app/shared/components/hs-switch/hs-switch.component';

interface InputProps extends FormlyFieldProps {
  styles?: Object;
  disabled?: boolean;
  customValues: ISwitchCustomValues;
}

@Component({
  selector: 'formly-field-grid-radio',
  template: `
    <div [style]="props['styles'] | concatUnits">
      <hs-switch
        [formControl]="formControl"
        [disabled]="props.disabled || false"
        [customValues]="props.customValues || { active: true, inactive: false }"
      ></hs-switch>
    </div>
  `,
  imports: [MatInputModule, ReactiveFormsModule, ConcatUnitsPipe, SwitchComponent],
})
export class FormlyFieldSwitch extends FieldType<FieldTypeConfig<InputProps>> {}
