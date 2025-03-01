import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

@Component({
  selector: 'formly-field-array',
  templateUrl: './formly-field-array.component.html',
  styleUrls: ['./formly-field-array.component.less'],
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FormlyModule,
    CommonModule,
    MatIcon,
    MatButtonModule,
  ],
})
export class FormlyFieldArrayComponent
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
