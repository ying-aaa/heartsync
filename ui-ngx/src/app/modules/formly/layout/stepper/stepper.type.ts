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
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
@Component({
  selector: 'formly-field-stepper',
  templateUrl: './stepper.type.html',
  styleUrls: ['./stepper.type.less'],
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
export class FormlyFieldStepper
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  isLinear = false;
  constructor() {
    super();
  }

  ngOnInit() {}
}
