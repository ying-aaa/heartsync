import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import {
  ICdkDrapActionType,
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';
import { ConcatUnitsPipe } from '@shared/pipes/units.pipe';
import { MatTableModule } from '@angular/material/table';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { FormEditorService } from '@src/app/core/services/form-editor.service';

@Component({
  selector: 'formly-field-subtable',
  templateUrl: './subtable.type.html',
  styleUrls: ['./subtable.type.less'],
  imports: [
    FormlyModule,
    MatButtonModule,
    MatTableModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    ConcatUnitsPipe,
    MatIconModule,
  ],
})
export class FormlyFieldSubTable
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  IFieldType = IFieldType;

  constructor(public formEditorService: FormEditorService) {
    super();
  }

  getSubTableItemWidth(
    fieldGroup: IEditorFormlyField[],
    itemField: IEditorFormlyField,
  ): string {
    const itemRow = itemField.props?.['row'] ?? 0;
    const totalRow = fieldGroup.reduce(
      (acc, ori) => acc + (ori.props?.['row'] ?? 0),
      0,
    );
    return (itemRow / totalRow) * 100 + '%';
  }

  cdkDropListDropped(event: CdkDragDrop<IEditorFormlyField[]> | any) {
    if (!event.item.data) return;
    const { action, field } = event.item.data;
    const fromParent: IEditorFormlyField[] = event.previousContainer.data;
    const toParent: IEditorFormlyField[] = event.container.data;
    const toParentFieldId: string = event.container.id;
    const { previousIndex: formIndex, currentIndex: toIndex } = event;

    if (action === ICdkDrapActionType.COPY) {
      this.formEditorService.addField(field, toParent, toIndex);
    }
    if (action === ICdkDrapActionType.MOVE) {
      if (event.previousContainer === event.container) {
        this.formEditorService.moveField(
          toParent,
          event.previousIndex,
          event.currentIndex,
        );
      } else {
        this.formEditorService.transferField(
          fromParent,
          toParent,
          formIndex,
          toIndex,
        );
      }
    }
  }

  getDragFieldData = (field: IEditorFormlyField) => ({
    action: ICdkDrapActionType.MOVE,
    field,
  });

  getGridTemplateColumns(fieldGroup: IEditorFormlyField[]) {
    return fieldGroup.reduce(
      (acc, ori) => acc + ` minmax(0px, ${ori.props?.['row']}fr)`,
      '',
    );
  }
  ngOnInit() {}
}
