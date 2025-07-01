// chips-autocomplete.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  ElementRef,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AbstractControlDirective,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IAnyPropObj } from '@src/app/shared/models/common-component';

@Component({
  selector: 'hs-chips-autocomplete',
  templateUrl: './hs-chips-autocomplete.component.html',
  styleUrls: ['./hs-chips-autocomplete.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsAutocompleteComponent),
      multi: true,
    },
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => ChipsAutocompleteComponent),
    },
  ],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
    '(click)': 'focus()',
  },
})
export class ChipsAutocompleteComponent
  implements MatFormFieldControl<string[]>, ControlValueAccessor
{
  static nextId = 0;

  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  private _value: string[] = [];
  inputValue = '';
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'chips-autocomplete';
  id = `chips-autocomplete-${ChipsAutocompleteComponent.nextId++}`;
  describedBy = '';

  @Input() ariaLabel = 'Selection';
  @Input() placeholder = '';
  @Input() options: IAnyPropObj[] = [];
  @Input() separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() labelField: string = 'name';
  @Input() valueField: string = 'id';

  @Output() chipAdded = new EventEmitter<string>();
  @Output() chipRemoved = new EventEmitter<string>();

  private announcer = inject(LiveAnnouncer);
  private cdr = inject(ChangeDetectorRef);

  onChange: any = () => {};
  onTouched: any = () => {};

  // constructor(@Optional() @Self() public ngControl: NgControl) {
  //   if (this.ngControl != null) {
  //     this.ngControl.valueAccessor = this;
  //   }
  // }
  constructor() {}

  ngControl: NgControl | AbstractControlDirective | null;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;
  disableAutomaticLabeling?: boolean | undefined;

  get value(): string[] {
    return this._value;
  }

  set value(value: string[]) {
    this._value = value || [];
    this.onChange(this._value);
    this.stateChanges.next();
  }

  get empty(): boolean {
    return this._value.length === 0 && !this.inputValue;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = value;
    this.stateChanges.next();
  }
  private _required = false;

  getOptionLabelByValue(value: any): string {
    const matchValue = this.options.find(
      (option) => option[this.valueField] === value,
    );
    return matchValue ? matchValue[this.labelField] : value;
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if (!this.focused) {
      this.focus();
    }
  }

  writeValue(value: string[]): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  filteredOptions(): IAnyPropObj[] {
    const inputValue = this.inputValue.toLowerCase();
    return this.options.filter(
      (option) =>
        !this.value.includes(option[this.valueField]) &&
        option[this.labelField].toLowerCase().includes(inputValue),
    );
  }

  removeItem(item: string): void {
    const index = this.value.indexOf(item);

    if (index >= 0) {
      this.value = [
        ...this.value.slice(0, index),
        ...this.value.slice(index + 1),
      ];
      this.chipRemoved.emit(item);
      this.announcer.announce(`Removed ${item}`);
      this.stateChanges.next();
    }
  }

  // Select item from autocomplete
  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;

    if (value && !this.value.includes(value)) {
      this.value = [...this.value, value];
      this.chipAdded.emit(value);
      this.announcer.announce(`Added ${value}`);
      this.stateChanges.next();
    }

    this.inputElement.nativeElement.value = '';
    this.inputValue = '';
  }

  focus(): void {
    if (!this.disabled) {
      this.inputElement.nativeElement.focus();
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
    this.stateChanges.next();
  }
}
