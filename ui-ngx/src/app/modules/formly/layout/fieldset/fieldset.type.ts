import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { ConcatUnitsPipe } from '@shared/pipes/units.pipe';

@Component({
  selector: 'formly-field-fieldset',
  template: `
    <fieldset class="min-w-inherit" [style]="field.props?.['styles'] | concatUnits">
      <legend class="block max-w-full p-0 text-inherit leading-inherit whitespace-normal">
        {{ props.label }}
      </legend>
      @for (f of field.fieldGroup; track $index) {
        <formly-field [field]="f"> </formly-field>
      }
    </fieldset>
  `,
  imports: [FormlyModule, ConcatUnitsPipe],
})
export class FormlyFieldFieldset extends FieldType<IEditorFormlyField> implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
