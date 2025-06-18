// Inline Editor Component
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild,
  input,
  effect,
  computed,
  signal,
  Optional,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { HsSwitchFormFieldComponent } from './hs-switch-form-field.component';

type EditorType = 'text' | 'select' | 'switch' | 'slider' | 'progress';

@Component({
  selector: 'hs-inline-editor',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HsInlineEditorComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class HsInlineEditorComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('formFieldRef') formFieldRef: MatFormField;
  @ViewChild('inputRef') inputRef:
    | ElementRef<HTMLInputElement>
    | MatSelect
    | MatSlideToggle
    | HsSwitchFormFieldComponent;

  value = input<string | boolean | number>('');
  @Input() type: EditorType = 'text';

  @Input() highlight: boolean = false;
  @Input() showButton = true;
  @Input() selectOptions: any = [];
  @Input() sliderMin = 0;
  @Input() sliderMax = 100;
  @Input() sliderStep = 1;
  @Input() triggerStyle: string = '';
  @Input() customClass: string = '';
  @Input() customStyle: Object = {};
  @Input() selectLabelField: string;
  @Input() disabled: boolean = false;

  @Output() onChange = new EventEmitter<string | boolean | number>();
  @Output() editConfirm = new EventEmitter();
  @Output() editCancel = new EventEmitter();
  @Output() editStart = new EventEmitter();

  displayValue = computed(() => {
    const value = this.isUsingNgModel ? this.textValue() : this.value();
    if (this.type === 'select' && this.selectLabelField) {
      const selectedOption = this.selectOptions.find(
        (option: any) => option.value === value,
      );
      return selectedOption ? selectedOption[this.selectLabelField] : '';
    }
    return value;
  });

  private propagateChange = (value: string | boolean | number) => {};

  textValue = signal<string | boolean | number>('');

  isEdit = false;

  isUsingNgModel = false;

  constructor() {
    effect(() => {
      this.textValue.set(this.value());
    });
  }
  writeValue(value: string | boolean | number): void {
    if (!this.isUsingNgModel) this.isUsingNgModel = true;
    this.textValue.set(value);
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  editTriggerEvent(event: Event) {
    if (this.disabled) return;
    this.isEdit = true;
    this.editStart.emit();
    setTimeout(() => {
      if (this.inputRef) {
        this.handleInputElement();
        document.addEventListener('click', this.globalClickListener);
        document.addEventListener('keydown', this.globalEnterListener);
      }
    }, 50);
  }

  handleInputElement() {
    const inputRefConstructor = this.inputRef.constructor;
    switch (inputRefConstructor) {
      case ElementRef:
        const nativeElement = (this.inputRef as ElementRef).nativeElement;
        nativeElement.focus();
        nativeElement.select();

        break;
      case MatSelect:
        (this.inputRef as MatSelect).open();
        break;
    }
  }

  globalEnterListener = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      console.log("%c Line:136 🍡", "color:#ed9ec7", this);
      this.confirmEdit();
    }
  }

  globalClickListener = (event: Event) => {
    const target = event.target as HTMLElement;

    const excludingElements = ['mat-option'];

    const formFieldElement = this.formFieldRef?._elementRef.nativeElement;

    const clickedInside = formFieldElement?.contains(event.target as Node);

    const isExcludingElement = excludingElements.some(
      (tag) => target.localName === tag || target.closest(tag) !== null,
    );
    if (!clickedInside && !isExcludingElement) this.confirmEdit();
  };

  confirmEdit() {
    this.isEdit = false;
    this.editConfirm.emit(this.textValue());
    this.onChange.emit(this.textValue());
    this.propagateChange(this.textValue());
    document.removeEventListener('click', this.globalClickListener);
    document.removeEventListener('keydown', this.globalEnterListener);
  }

  cancelEdit() {
    this.isEdit = false;
    document.removeEventListener('click', this.globalClickListener);
    document.removeEventListener('keydown', this.globalEnterListener);
    this.textValue.set(this.value());
    this.editCancel.emit(this.textValue());
  }

  changeValue(event: any) {
    this.onChange.emit(this.textValue());
    this.propagateChange(this.textValue());
  }

  ngOnDestroy(): void {}
  ngOnInit(): void {}
}
