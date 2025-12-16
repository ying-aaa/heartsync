import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { HsColorPickerComponent } from '@src/app/shared/components/hs-color-picker/hs-color-picker.component';
import { ConcatUnitsPipe } from '@shared/pipes/units.pipe';

interface InputProps extends FormlyFieldProps {
  styles?: Object;
  disabled?: boolean;
  title?: string;
  displayType?: 'block' | 'input' | 'readonly';
  allowClear?: boolean;
  open?: boolean;
  disabledAlpha?: boolean;
  format?: any;
  onChange?: (value: string) => void;
  onFormatChange?: (value: any) => void;
  onClear?: () => void;
  onOpenChange?: (value: boolean) => void;
}

@Component({
  selector: 'formly-field-color-picker',
  template: `
    <hs-color-picker
      [formControl]="formControl"
      displayType="readonly"
      [style]="props.styles | concatUnits"
      [disabled]="props.disabled || false"
      [displayType]="props.displayType || 'block'"
      [allowClear]="props.allowClear || false"
      [disabledAlpha]="props.disabledAlpha || false"
      [format]="props.format || 'hex'"
      (onChange)="props.onChange && props.onChange($event)"
      (onFormatChange)="props.onFormatChange && props.onFormatChange($event)"
      (onClear)="props.onClear && props.onClear()"
      (onOpenChange)="props.onOpenChange && props.onOpenChange($event)"
    ></hs-color-picker>
  `,
  imports: [MatInputModule, ReactiveFormsModule, HsColorPickerComponent, ConcatUnitsPipe],
})
export class FormlyFieldColorPicker extends FieldType<FieldTypeConfig<InputProps>> {}
