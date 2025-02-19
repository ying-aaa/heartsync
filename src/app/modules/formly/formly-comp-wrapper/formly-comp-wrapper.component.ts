import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { WidgetEditorService } from '../../workbench/lowcode/page/widget-editor/widget-editor.service';
import { takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'formly-comp-wrapper',
  templateUrl: './formly-comp-wrapper.component.html',
  styleUrls: ['./formly-comp-wrapper.component.less'],
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
})
export class FormlyCompWrapperComponent
  extends FieldWrapper<IEditorFormlyField>
  implements OnInit, OnDestroy
{
  @HostBinding('class.active') get isActiveField(): boolean {
    return this._isActiveField;
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
    this.widgetEditorService.selectField(this.field);
    event.stopPropagation();
  }

  ngOnInit(): void {
    // .pipe(takeUntil(this._destroy$))
    this.widgetEditorService.fieldSelected$.subscribe(() => {
      // this._checkIndexField();
      this._checkActiveField();
      // this.cdr.markForCheck();
      // this.cdr.markForCheck();
    });
  }

  private _checkActiveField(): void {
    this._isActiveField = this.widgetEditorService.isActiveField(
      this.field.fieldId!,
    );
  }
  ngOnDestroy(): void {}
}
