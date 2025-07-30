import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'verse-design-mode-switch',
  templateUrl: './verse-design-mode-switch.component.html',
  styleUrls: ['./verse-design-mode-switch.component.less'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerseDesignModeSwitchComponent),
      multi: true,
    },
  ],
})
export class VerseDesignModeSwitchComponent
  implements ControlValueAccessor, OnInit
{
  @Input() tooltip = '';

  isChecked = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  ngOnInit(): void {
    this.onChange(this.isChecked);
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.isChecked = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onToggleChange(event: Event): void {
    this.isChecked = (event.target as HTMLInputElement).checked;
    this.onChange(this.isChecked);
    this.onTouched();
  }
}
