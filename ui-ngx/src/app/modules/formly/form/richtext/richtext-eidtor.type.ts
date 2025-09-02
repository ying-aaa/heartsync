import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field'; // 👈 关键
import { HsRichtextEditorComponent } from '@src/app/shared/components/hs-richtext-editor/hs-richtext-editor.component';

interface InputProps extends FormlyFieldProps {}

@Component({
  selector: 'formly-field-richtext',
  template: `
    <hs-richtext-editor
      (onChange)="formControl.setValue($event)"
      [disabled]="props.disabled || false"
      [placeholder]="props.placeholder || ''"
    ></hs-richtext-editor>
  `,
  imports: [MatInputModule, ReactiveFormsModule, HsRichtextEditorComponent],
})
export class FormlyFieldRichtext extends FieldType<
  FieldTypeConfig<InputProps>
> {}
