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
  selector: 'formly-field-mat-stepper',
  templateUrl: './formly-field-mat-stepper.component.html',
  styleUrls: ['./formly-field-mat-stepper.component.less'],
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
export class FormlyFieldMatStepperComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  isLinear = false;
  constructor() {
    super();
  }

  ngOnInit() {}
}
