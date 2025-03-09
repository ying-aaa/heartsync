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
import { WidgetEditorService } from '../../../workbench/lowcode/page/widget/widget-editor.service';

@Component({
  selector: 'formly-field-tabs',
  templateUrl: './formly-field-tabs.component.html',
  styleUrls: ['./formly-field-tabs.component.less'],
  imports: [CdkDrag, CdkDropList, MatTabsModule, FormlyModule],
})
export class FormlyFieldTabsComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  IFieldType = IFieldType;

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
    this.options.build!();
  }

  getDragFieldData = (field: IEditorFormlyField) => ({
    action: ICdkDrapActionType.MOVE,
    field,
  });

  ngOnInit() {}
}
