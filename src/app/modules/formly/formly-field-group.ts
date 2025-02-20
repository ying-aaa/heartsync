// panel-wrapper.component.ts
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { WidgetEditorService } from '../workbench/lowcode/page/widget-editor/widget-editor.service';

@Component({
  selector: 'formly-wrapper-group',
  template: `
    <fieldset>
      <legend>{{ props.label }}</legend>
      {{ widgetEditorService.getConnectedTo(IFieldType.GROUP) }}
      <div>{{ field.fieldId }}</div>
      <div
        class="cdk-group-list grid"
        style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));"
        cdkDropListOrientation="horizontal"
        cdkDropListGroup
        cdkDropList
        [cdkDropListData]="field.fieldGroup"
        [cdkDropListConnectedTo]="['cdk-group-list']"
        [id]="field.fieldId || ''"
        [cdkDropListConnectedTo]="
          widgetEditorService.getConnectedTo(IFieldType.GROUP)
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
            class="position-preview w-full h-full border-2px border-dashed"
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
    </fieldset>
  `,
  imports: [CdkDropList, CdkDrag, FormlyModule, CdkDragPlaceholder],
  styles: [
    `
      fieldset {
        padding: 0 16px 8px;
        margin-bottom: 10px;
        border: 1px groove #2c7eac;
        border-radius: 4px;
      }
      legend {
        display: block;
        max-width: 100%;
        margin-bottom: 0.8em;
        padding: 0;
        color: inherit;
        font-size: 1.2em;
        line-height: inherit;
        white-space: normal;
      }
    `,
  ],
})
export class FormFieldGroup extends FieldWrapper<IEditorFormlyField> {
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
