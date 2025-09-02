import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import {
  ICdkDrapActionType,
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';
import { FormEditorService } from '@core/services/form-editor.service';

@Component({
  selector: 'formly-field-tabs',
  templateUrl: './tabs.type.html',
  styleUrls: ['./tabs.type.less'],
  imports: [CdkDrag, CdkDropList, MatTabsModule, FormlyModule],
})
export class FormlyFieldTabs
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  IFieldType = IFieldType;

  constructor(public formEditorService: FormEditorService) {
    super();
  }
  cdkDropListDropped(event: CdkDragDrop<IEditorFormlyField[]> | any) {
    if (!event.item.data) return;
    const { action, field } = event.item.data;
    const fromParent: IEditorFormlyField[] = event.previousContainer.data;
    const toParent: IEditorFormlyField[] = event.container.data;
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
    this.options.build!();
  }

  getDragFieldData = (field: IEditorFormlyField) => ({
    action: ICdkDrapActionType.MOVE,
    field,
  });

  ngOnInit() {}
}
