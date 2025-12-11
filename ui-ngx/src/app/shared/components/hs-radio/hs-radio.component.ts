import { Component, input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { IRadioConfig } from '../../models/system.model';

@Component({
  selector: 'hs-radio',
  templateUrl: './hs-radio.component.html',
  styleUrls: ['./hs-radio.component.less'],
  imports: [MatRippleModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HsRadioComponent),
      multi: true,
    },
  ],
})
export class HsRadioComponent implements OnInit, ControlValueAccessor {
  configs = input.required<IRadioConfig[] | []>();
  rows = input<number>(1);

  private _value: string = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private _disabled = false;

  constructor() {}

  ngOnInit() {}

  // 计算网格布局样式
  styleComputer = () => {
    return {
      'grid-template-columns': `
        repeat(${Math.ceil(this.configs().length / this.rows())}, 
        ${this.rows()}fr)
      `,
      'pointer-events': this._disabled ? 'none' : 'auto',
    };
  };

  // 获取当前值
  get value(): string {
    return this._value;
  }

  // 设置当前值
  set value(newValue: string) {
    if (newValue !== this._value && !this._disabled) {
      this._value = newValue;
      this.onChange(newValue);
    }
    this.onTouched();
  }

  onOptionClick(item: IRadioConfig): void {
    if (!this._disabled) {
      this.value = item.value;
    }
  }

  writeValue(value: string): void {
    if (value !== this._value) {
      this._value = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  isActive(itemValue: string): boolean {
    return this._value === itemValue;
  }

  get isDisabled(): boolean {
    return this._disabled;
  }
}
