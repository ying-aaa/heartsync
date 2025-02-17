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

@Component({
  selector: 'formly-wrapper-col',
  template: `
    <div
      class="flex flex-col p-5px"
      [id]="ids"
      id="cdk-col-list"
      cdkDropList
      [cdkDropListConnectedTo]="[
        'cdk-col-list',
        'cdk-col-list1',
        'cdk-col-list2',
        'cdk-col-list3',
        'cdk-col-list4',
        'cdk-col-list5',
        'cdk-col'
      ]"
    >
      @for (f of field.fieldGroup; track $index) {
      <formly-field
        cdkDrag
        [field]="f"
      >
        <div
          class="w-full h-3px border-2px border-dashed border-#333"
          *cdkDragPlaceholder
        ></div>
      </formly-field>
      }
    </div>
  `,
  imports: [CdkDropList, CdkDrag, FormlyModule, CdkDragPlaceholder],
})
export class FormFieldCol extends FieldWrapper {
  get ids() {
    return this.props.attributes?.['class'] as string;
  }
}
