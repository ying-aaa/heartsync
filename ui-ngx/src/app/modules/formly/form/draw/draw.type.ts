import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field'; // 👈 关键
import { HsDrawComponent } from '@src/app/shared/components/hs-draw/hs-draw.component';

interface InputProps extends FormlyFieldProps {}

@Component({
  selector: 'formly-field-draw',
  template: `
    <hs-draw
      (onChange)="formControl.setValue($event)"
      [disabled]="props.disabled || false"
      [placeholder]="props.placeholder || ''"
    ></hs-draw>
  `,
  imports: [MatInputModule, ReactiveFormsModule, HsDrawComponent],
})
export class FormlyFieldDraw extends FieldType<
  FieldTypeConfig<InputProps>
> {}
