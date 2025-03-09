import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetEditorService } from '@app/modules/workbench/lowcode/page/widget/widget-editor.service';

@Component({
  selector: 'formly-control-wrapper',
  templateUrl: './formly-control-wrapper.component.html',
  styleUrls: ['./formly-control-wrapper.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
})
export class FormlyContorlWrapperComponent
  extends FieldWrapper<IEditorFormlyField>
  implements OnInit, OnDestroy
{
  @HostBinding('class.edit-mode')
  get isEditMode() {
    return !!this.widgetEditorService.isEditMode();
  }

  @HostBinding('class.show-border') get isShowBorder() {
    return (
      this.field.type === IFieldType.GRID || this.field.type === IFieldType.FLEX
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
      !this.widgetEditorService.dragStart
    );
  }

  private _isActiveField = false;

  isMouseInside = false;

  constructor(
    public widgetEditorService: WidgetEditorService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.isEditMode) return;
    this.widgetEditorService.selectField(this.field);
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

  ngOnInit(): void {
    this._checkActiveField();
    this.widgetEditorService.fieldSelected$.subscribe(() => {
      this._checkActiveField();
      this.cdr.markForCheck();
    });
  }

  private _checkActiveField(): void {
    this._isActiveField = this.widgetEditorService.isActiveField(
      this.field.fieldId!,
    );
  }
  ngOnDestroy(): void {}
}
