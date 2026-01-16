import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { IEditorFormlyField, IFieldType } from '@src/app/shared/models/widget.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormlyFormService } from '../../formly-form.service';

@Component({
  selector: 'formly-wrapper-control',
  templateUrl: './control.wrapper.html',
  styleUrls: ['./control.wrapper.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
})
export class FormlyWrapperContorl
  extends FieldWrapper<IEditorFormlyField>
  implements OnInit, OnDestroy
{
  @HostBinding('class.edit-mode')
  get isEditMode() {
    return !!this.options.formState.isEditMode();
  }

  @HostBinding('class.show-border') get isShowBorder() {
    return (
      this.field.type === IFieldType.GRID ||
      this.field.type === IFieldType.FLEX ||
      this.field.type === IFieldType.SUBTABLE
    );
  }

  @HostBinding('class.active')
  get isActiveField(): boolean {
    return this.isEditMode && this._isActiveField;
  }

  @HostBinding('class.hover') get isHoverField(): boolean {
    return (
      this.isEditMode &&
      this.isMouseInside &&
      !this._isActiveField &&
      !this.options.formState.dragStart
    );
  }

  private _isActiveField = false;

  isMouseInside = false;

  constructor(
    private formlyFormService: FormlyFormService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    effect(() => {
      this._checkActiveField();
    });
  }

  addField() {
    this.formlyFormService.addField(
      this.field,
      this.field.parent!.fieldGroup!,
      this.field.index! + 1,
    );
    this.formlyFormService.syncFormilyForm(this);
  }

  removeField() {
    this.formlyFormService.removeField(this.field.parent!.fieldGroup!, this.field.index!);
    this.formlyFormService.syncFormilyForm(this);
    this.options.formState.selectField &&  this.options.formState.selectField(null)
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.isEditMode) return;
    this.options.formState.selectField(this.field);
    event.stopPropagation();
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    this.isMouseInside = true;
    event.stopPropagation();
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event: MouseEvent): void {
    this.isMouseInside = false;
  }

  private _checkActiveField(): void {
    this._isActiveField = this.field.fieldId! === this.options.formState.activeField()?.fieldId;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
