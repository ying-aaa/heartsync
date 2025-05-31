import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AbstractControlDirective,
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

@Component({
  selector: 'hs-switch-form-field',
  template: `
    <mat-slide-toggle
      [checked]="checked"
      (change)="onToggleChange($event)"
    >
    </mat-slide-toggle>
  `,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => HsSwitchFormFieldComponent),
    },
  ],
  standalone: false,
})
export class HsSwitchFormFieldComponent
  implements MatFormFieldControl<boolean>, ControlValueAccessor
{
  static nextId = 0;

  @Input() checked: any = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  focused = false;
  stateChanges = new Subject<void>();
  id = `mat-slide-toggle-form-field-${HsSwitchFormFieldComponent.nextId++}`;
  describedByIds = new Set<string>();

  get empty(): boolean {
    return !this.checked;
  }

  get shouldLabelFloat(): boolean {
    return true;
  }

  get placeholder(): string {
    return '';
  }

  get value(): boolean {
    return this.checked;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  private _disabled: boolean = false;

  constructor() {}
  ngControl: NgControl | AbstractControlDirective | null;
  required: boolean;
  errorState: boolean;
  controlType?: string | undefined;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;
  disableAutomaticLabeling?: boolean | undefined;
  setDescribedByIds(ids: string[]): void {}
  onContainerClick(event: MouseEvent): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
    this.onChange(this.checked);
  }

  onToggleChange(event: any) {}

  //实现 ControlValueAccessor
  onChange = (_: boolean) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (value: boolean) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  focus(): void {
    this.focused = true;
  }

  blur(): void {
    this.focused = false;
  }
}
