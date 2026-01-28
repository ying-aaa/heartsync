import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ISwitchCustomValues {
  active: any;
  inactive: any;
}

@Component({
  selector: 'hs-switch',
  templateUrl: './hs-switch.component.html',
  styleUrls: ['./hs-switch.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  innerValue: boolean = false;

  @Input() customValues: ISwitchCustomValues = {
    active: true,
    inactive: false,
  };

  @Input() disabled: boolean = false;
  @Input() label: string = '';

  @Output() valueChange = new EventEmitter<any>();

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(externalValue: any): void {
    if (externalValue === null || externalValue === undefined) {
      this.innerValue = false;
      return;
    }
    this.innerValue = externalValue === this.customValues.active;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onToggle(): void {
    if (this.disabled) return;

    this.innerValue = !this.innerValue;
    const outputValue = this.innerValue ? this.customValues.active : this.customValues.inactive;

    this.onChange(outputValue);
    this.onTouched();
    this.valueChange.emit(outputValue);
  }
}
