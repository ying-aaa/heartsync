// panel-wrapper.component.ts
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Component, HostListener, ViewChild } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import {
  ICdkDrapActionType,
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';
import { WidgetEditorService } from '@app/modules/workbench/lowcode/page/widget/widget-editor.service';
import { CommonModule } from '@angular/common';
import { ConcatUnitsPipe } from '../../../../shared/pipes/units.pipe';

@Component({
  selector: 'formly-field-wrapper',
  templateUrl: './formly-field-wrapper.component.html',
  styleUrls: ['./formly-field-wrapper.component.less'],
  host: { '[class.formly-field-wrapper]': 'true' },
  imports: [
    CdkDropList,
    CdkDrag,
    FormlyModule,
    CdkDragPlaceholder,
    CommonModule,
    ConcatUnitsPipe,
  ],
})
export class FormlyFieldWrapperComponent extends FieldType<IEditorFormlyField> {
  @ViewChild(CdkDropList) dropList!: CdkDropList;

  IFieldType = IFieldType;
  constructor(public widgetEditorService: WidgetEditorService) {
    super();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.widgetEditorService.mousePosition.x = event.clientX;
    this.widgetEditorService.mousePosition.y = event.clientY;
  }

  canEnter = (drag: CdkDrag) => {
    const isInDropContainer = this._isMouseInElement(
      drag.dropContainer.element.nativeElement,
    );
    const index = this.widgetEditorService
      .getConnectedTo(this.IFieldType.COLUMN)
      .indexOf(this.dropList.id);
    const dropContainerIndex = this.widgetEditorService
      .getConnectedTo(this.IFieldType.COLUMN)
      .indexOf(drag.dropContainer.id);
    return !(isInDropContainer && dropContainerIndex < index);
  };

  cdkDropListDropped(event: CdkDragDrop<IEditorFormlyField[]> | any) {
    if (!event.item.data) return;
    const { action, field } = event.item.data;
    const fromParent: IEditorFormlyField[] = event.previousContainer.data;
    const toParent: IEditorFormlyField[] = event.container.data;
    const toParentFieldId: string = event.container.id;
    const { previousIndex: formIndex, currentIndex: toIndex } = event;

    if (action === ICdkDrapActionType.COPY) {
      this.widgetEditorService.addField(field, toParent, toIndex);
    }
    if (action === ICdkDrapActionType.MOVE) {
      if (event.previousContainer === event.container) {
        this.widgetEditorService.moveField(
          toParent,
          event.previousIndex,
          event.currentIndex,
        );
      } else {
        this.widgetEditorService.transferField(
          fromParent,
          toParent,
          formIndex,
          toIndex,
        );
      }
    }
  }

  getDragFieldData = (field: IEditorFormlyField) => ({
    action: ICdkDrapActionType.MOVE,
    field,
  });

  private _isMouseInElement(droplistElement: HTMLElement): boolean {
    const rect: DOMRect = droplistElement.getBoundingClientRect();
    const { x, y } = this.widgetEditorService.mousePosition;
    const isInWidth = x >= rect.left && x <= rect.right;
    const isInHeight = y >= rect.top && y <= rect.bottom;
    return isInWidth && isInHeight;
  }
}
