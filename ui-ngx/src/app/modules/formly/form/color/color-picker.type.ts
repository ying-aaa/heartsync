import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field'; // 👈 关键
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { ColorPickerDirective } from 'ngx-color-picker';

interface InputProps extends FormlyFieldProps {}

@Component({
  selector: 'formly-field-color-picker',
  template: `
    <input
      matInput
      color-picker
      [cpOutputFormat]="'rgba'"
      [formControl]="formControl"
      [(colorPicker)]="formControl.value"
      [style.background]="formControl.value"
      (colorPickerChange)="formControl.setValue($event)"
      [cpEyeDropper]="true"
      [cpSaveClickOutside]="false"
      [cpPresetColors]="['#fff', '#2889e9']"
      [cpOKButton]="true"
      [cpCancelButton]="true"
      [cpCancelButtonText]="'取消'"
      [cpOKButtonText]="'确定'"
      cpCancelButtonClass="cursor-pointer"
      cpOKButtonClass="cursor-pointer"
      [cpPosition]="'bottom'"
      [cpPositionOffset]="'0%'"
      [cpPositionRelativeToArrow]="true"
      [disabled]="props.disabled || false"
      [placeholder]="props.placeholder || ''"
      [readonly]="props.readonly"
      [required]="required"
    />
  `,
  imports: [MatInputModule, ReactiveFormsModule, ColorPickerDirective],
})
export class FormlyFieldColorPicker extends FieldType<
  FieldTypeConfig<InputProps>
> {}
