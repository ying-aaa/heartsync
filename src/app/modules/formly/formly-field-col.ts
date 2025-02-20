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
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { WidgetEditorService } from '../workbench/lowcode/page/widget-editor/widget-editor.service';

@Component({
  selector: 'formly-wrapper-col',
  template: `
    <div
      class="flex flex-col p-5px min-h-48px "
      [id]="field.fieldId || ''"
      cdkDropList
      [cdkDropListData]="field.fieldGroup"
      [cdkDropListConnectedTo]="
        widgetEditorService.getConnectedTo(IFieldType.COL)
      "
      (cdkDropListDropped)="cdkDropListDropped($event)"
    >
      @for (f of field.fieldGroup; track $index) {
      <formly-field
        cdkDrag
        [cdkDragData]="f"
        [field]="f"
        (cdkDragStarted)="widgetEditorService.dragStart = true"
        (cdkDragReleased)="widgetEditorService.dragStart = false"
      >
        <div
          class="position-preview w-full h-3px border-2px border-dashed"
          *cdkDragPlaceholder
        ></div>
      </formly-field>
      }@empty {
      <div
        class="text-#a7b1bd border-1px border-solid text-14px border-#ccc min-h-48px flex-center min-w-48px bg-#f1f1f1"
      >
        拖拽组件到这里
      </div>
      }
    </div>
  `,
  imports: [CdkDropList, CdkDrag, FormlyModule, CdkDragPlaceholder],
})
export class FormFieldCol extends FieldWrapper<IEditorFormlyField> {
  IFieldType = IFieldType;
  constructor(public widgetEditorService: WidgetEditorService) {
    super();
  }

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
}
