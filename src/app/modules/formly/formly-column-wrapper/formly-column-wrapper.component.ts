// panel-wrapper.component.ts
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { WidgetEditorService } from '@app/modules/workbench/lowcode/page/widget/widget-editor.service';

@Component({
  selector: 'app-formly-column-wrapper',
  templateUrl: './formly-column-wrapper.component.html',
  styleUrls: ['./formly-column-wrapper.component.less'],
  imports: [CdkDropList, CdkDrag, FormlyModule, CdkDragPlaceholder],
})
export class FormlyColumnWrapperComponent extends FieldWrapper<IEditorFormlyField> {
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
    const currentParent: IEditorFormlyField = event.previousContainer.data;
    const targetParent: IEditorFormlyField = event.container.data;
    if (event.previousContainer === event.container) {
      this.widgetEditorService.moveField(
        targetParent,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      this.widgetEditorService.transferField(
        currentParent,
        targetParent,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  private _isMouseInElement(droplistElement: HTMLElement): boolean {
    const rect: DOMRect = droplistElement.getBoundingClientRect();
    const { x, y } = this.widgetEditorService.mousePosition;
    const isInWidth = x >= rect.left && x <= rect.right;
    const isInHeight = y >= rect.top && y <= rect.bottom;
    return isInWidth && isInHeight;
  }
}
