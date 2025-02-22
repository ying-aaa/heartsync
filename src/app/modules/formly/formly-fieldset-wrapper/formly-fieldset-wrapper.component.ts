import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

@Component({
  selector: 'formly-fieldset-wrapper',
  template: `
    <fieldset
      class="p-0 p-x-4 p-b-2 mb-2.5 border border-groove border-[#2c7eac] rounded-md"
    >
      <legend
        class="block max-w-full mb-2 p-0 text-inherit text-xl leading-inherit whitespace-normal"
      >
        {{ props.label }}
      </legend>
      @for (f of field.fieldGroup; track $index) {
      <formly-field [field]="f">
        <div
          class="position-preview w-full border-2px border-dashed"
          *cdkDragPlaceholder
        ></div>
      </formly-field>
      }
    </fieldset>
  `,
  imports: [FormlyModule],
})
export class FormlyFieldsetWrapperComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit() {}
}
