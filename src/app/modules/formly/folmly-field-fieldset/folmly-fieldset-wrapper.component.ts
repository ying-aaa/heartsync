import { Component, OnInit } from '@angular/core';
// panel-wrapper.component.ts
import {
  // CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  // CdkDropList,
  // CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { FieldType, FieldWrapper, FormlyModule } from '@ngx-formly/core';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { WidgetEditorService } from '@app/modules/workbench/lowcode/page/widget/widget-editor.service';

@Component({
  selector: 'folmly-fieldset-wrapper',
  templateUrl: './folmly-fieldset-wrapper.component.html',
  styleUrls: ['./folmly-fieldset-wrapper.component.less'],
  imports: [
    // CdkDropList, CdkDrag,
    FormlyModule,
    CdkDragPlaceholder,
  ],
})
export class FolmlyFieldsetWrapperComponent extends FieldType<IEditorFormlyField> {
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
