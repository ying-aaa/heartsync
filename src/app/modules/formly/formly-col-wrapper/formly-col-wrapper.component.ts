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
  selector: 'app-formly-col-wrapper',
  templateUrl: './formly-col-wrapper.component.html',
  styleUrls: ['./formly-col-wrapper.component.less'],
  imports: [CdkDropList, CdkDrag, FormlyModule, CdkDragPlaceholder],
})
export class FormlyColWrapperComponent extends FieldWrapper<IEditorFormlyField> {
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
