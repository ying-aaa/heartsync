import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { ConcatUnitsPipe } from '../../../shared/pipes/units.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'formly-fieldset-wrapper',
  template: `
    <fieldset
      class="min-w-inherit p-0 px-6px pt-12px p-b-2px mb-2.5px border border-groove border-[#2c7eac] rounded-8px"
      [style]="field.props?.['styles'] | concatUnits"
    >
      <legend
        class="block max-w-full p-0 text-inherit leading-inherit whitespace-normal"
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
  imports: [FormlyModule, ConcatUnitsPipe, CommonModule],
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
