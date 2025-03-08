import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import {
  ICdkDrapActionType,
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { ConcatUnitsPipe } from '@shared/pipes/units.pipe';
import { MatTableModule } from '@angular/material/table';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { WidgetEditorService } from '@src/app/modules/workbench/lowcode/page/widget/widget-editor.service';
import { FormlyContorlWrapperComponent } from '../control/formly-control-wrapper.component';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
];

@Component({
  selector: 'formly-field-subtable',
  templateUrl: './formly-field-subtable.component.html',
  styleUrls: ['./formly-field-subtable.component.less'],
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
export class FormlyFieldSubTableComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  IFieldType = IFieldType;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  constructor(public widgetEditorService: WidgetEditorService) {
    super();
  }

  cdkDropListDropped(event: CdkDragDrop<IEditorFormlyField[]> | any) {
    if (!event.item.data) return;
    const { action, field } = event.item.data;
    const fromParent: IEditorFormlyField[] = event.previousContainer.data;
    const toParent: IEditorFormlyField[] = event.container.data;
    const toParentFieldId: string = event.container.id;
    const { previousIndex: formIndex, currentIndex: toIndex } = event;

    if (action === ICdkDrapActionType.COPY) {
      this.widgetEditorService.addField(field, toParent, toIndex);
    }
    if (action === ICdkDrapActionType.MOVE) {
      if (event.previousContainer === event.container) {
        this.widgetEditorService.moveField(
          toParent,
          event.previousIndex,
          event.currentIndex,
        );
      } else {
        this.widgetEditorService.transferField(
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
