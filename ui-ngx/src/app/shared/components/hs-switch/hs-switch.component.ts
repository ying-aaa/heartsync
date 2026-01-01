import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  value: boolean = false;

  @Input() disabled: boolean = false;

  @Input() label: string = '';

  @Output() valueChange = new EventEmitter<boolean>();

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: boolean): void {
    this.value = value;
    this.valueChange.emit(value);
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
    if (!this.disabled) {
      this.value = !this.value;
      this.onChange(this.value);
      this.onTouched();
      this.valueChange.emit(this.value);
    }
  }
}
