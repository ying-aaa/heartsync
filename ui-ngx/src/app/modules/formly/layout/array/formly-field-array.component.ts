import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { FormEditorService } from '@src/app/modules/page/design/page/widget/form-editor.service';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

@Component({
  selector: 'formly-field-array',
  templateUrl: './formly-field-array.component.html',
  styleUrls: ['./formly-field-array.component.less'],
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    CdkDragPlaceholder,
    FormlyModule,
    MatIcon,
    MatButtonModule,
  ],
})
export class FormlyFieldArrayComponent
  extends FieldArrayType<IEditorFormlyField>
  implements OnInit
{
  constructor(private formEditorService: FormEditorService) {
    super();
  }

  cdkDropListDropped(event: CdkDragDrop<string[]>) {
    this.formEditorService.moveField(
      this.model,
      event.previousIndex,
      event.currentIndex,
    );
    this.options.build!();
  }

  addField(toIndex: number) {
    this.formEditorService.addField(
      this.model.at(-1),
      this.model,
      toIndex,
      false,
    );
    this.options.build!();
  }

  removeField(toIndex: number) {
    this.formEditorService.removeField(this.model, toIndex, false);
    this.options.build!();
  }

  ngOnInit() {}
}
