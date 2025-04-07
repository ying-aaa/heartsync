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
import { FormEditorService } from '@src/app/core/services/form-editor.service';
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

  getColumnItemWidth(
    fieldGroup: IEditorFormlyField[],
    itemField: IEditorFormlyField,
  ): string {
    const itemRow = itemField.props?.['row'] ?? 0;
    const totalRow = fieldGroup.reduce(
      (acc, ori) => acc + (ori.props?.['row'] ?? 0),
      0,
    );
    return `calc(100% * ${itemRow / totalRow}) `;
  }

  ngOnInit() {}
}
