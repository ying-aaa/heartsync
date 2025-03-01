import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
@Component({
  selector: 'formly-field-stepper',
  templateUrl: './formly-field-stepper.component.html',
  styleUrls: ['./formly-field-stepper.component.less'],
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormlyModule,
  ],
})
export class FormlyFieldStepperComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  isLinear = false;
  constructor() {
    super();
  }

  ngOnInit() {}
}
