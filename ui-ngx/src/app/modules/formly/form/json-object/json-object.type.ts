import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field'; // 👈 关键
import { JsonObjectEditorComponent } from '@src/app/shared/components/hs-json-editor/hs-json-editor.component';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';

interface InputProps extends FormlyFieldProps {
  styles?: Object;
  disabled?: boolean;
  placeholder?: string;
  toolbar?: boolean;
  inline?: boolean;
  title?: string;
  type?: string;
  editorStyle?: Object;
  options?: any;
}

@Component({
  selector: 'formly-field-json-object',
  template: `
    <div [style]="props!['styles'] | concatUnits">
      <hs-json-object-editor
        (onChange)="formControl.setValue($event)"
        [disabled]="props.disabled || false"
        [placeholder]="props.placeholder || ''"
        [toolbar]="props.toolbar || true"
        [inline]="props.inline || false"
        [title]="props.title || ''"
        [type]="props.type || 'html'"
        [editorStyle]="props.editorStyle || {}"
        [options]="props.options || {}"
      ></hs-json-object-editor>
    </div>
  `,
  imports: [MatInputModule, ReactiveFormsModule, JsonObjectEditorComponent, ConcatUnitsPipe],
})
export class FormlyFieldJsonObject extends FieldType<FieldTypeConfig<InputProps>> {}
