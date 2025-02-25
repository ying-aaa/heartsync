import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

@Component({
  selector: 'app-formly-array-wrapper',
  templateUrl: './formly-array-wrapper.component.html',
  styleUrls: ['./formly-array-wrapper.component.less'],
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FormlyModule,
    CommonModule,
    MatIcon,
  ],
})
export class FormlyArrayWrapperComponent
  extends FieldArrayType<IEditorFormlyField>
  implements OnInit
{
  constructor() {
    super();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.field.fieldGroup!,
      event.previousIndex,
      event.currentIndex,
    );
  }

  removeField(toParentField: IEditorFormlyField[], toIndex: number) {
    toParentField.splice(toIndex, 1);
  }

  ngOnInit() {}
}
