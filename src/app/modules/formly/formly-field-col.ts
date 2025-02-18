// panel-wrapper.component.ts
import {
  CdkDrag,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
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
      class="flex flex-col p-5px"
      [id]="field.fieldId || ''"
      cdkDropList
      [cdkDropListConnectedTo]="
        widgetEditorService.getConnectedTo(IFieldType.COL)
      "
    >
      @for (f of field.fieldGroup; track $index) {
      <formly-field
        cdkDrag
        [field]="f"
      >
        <div
          class="position-preview w-full h-3px border-2px border-dashed"
          *cdkDragPlaceholder
        ></div>
      </formly-field>
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
}
