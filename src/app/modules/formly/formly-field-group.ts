// panel-wrapper.component.ts
import {
  CdkDrag,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-group',
  template: `
    <fieldset>
      <legend>{{ props.label }}</legend>
      <div
        class="cdk-group-list grid gap-10px"
        style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));"
        cdkDropListOrientation="horizontal"
        cdkDropListGroup
        cdkDropList
        [cdkDropListConnectedTo]="['cdk-group-list']"
        [id]="ids"
        [cdkDropListConnectedTo]="['cdk-group-list1', 'cdk-group-list2']"
      >
        @for (f of field.fieldGroup; track $index) {
        <formly-field
          cdkDrag
          [field]="f"
        >
          <div
            class="w-full h-full border-2px border-dashed border-#333"
            *cdkDragPlaceholder
          ></div>
        </formly-field>
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
export class FormFieldGroup extends FieldWrapper {
  get ids() {
    return this.props.attributes?.['class'] as string;
  }
}
