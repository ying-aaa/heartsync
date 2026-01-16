import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import {
  ICdkDrapActionType,
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';
import { FormlyFormService } from '../../formly-form.service';

@Component({
  selector: 'formly-field-tabs',
  templateUrl: './tabs.type.html',
  styleUrls: ['./tabs.type.less'],
  imports: [CdkDrag, CdkDropList, MatTabsModule, FormlyModule],
})
export class FormlyFieldTabs extends FieldType<IEditorFormlyField> implements OnInit {
  IFieldType = IFieldType;

  constructor(
    private formlyFormService: FormlyFormService,
  ) {
    super();
  }
  cdkDropListDropped(event: CdkDragDrop<IEditorFormlyField[]> | any) {
    if (!event.item.data) return;
    const { action, field } = event.item.data;
    const fromParent: IEditorFormlyField[] = event.previousContainer.data;
    const toParent: IEditorFormlyField[] = event.container.data;
    const { previousIndex: formIndex, currentIndex: toIndex } = event;

    if (action === ICdkDrapActionType.COPY) {
      this.formlyFormService.addField(field, toParent, toIndex);
      this.formlyFormService.syncFormilyForm(this);
    }
    if (action === ICdkDrapActionType.MOVE) {
      if (event.previousContainer === event.container) {
        this.formlyFormService.moveField(toParent, event.previousIndex, event.currentIndex);
        this.formlyFormService.syncFormilyForm(this);
      } else {
        this.formlyFormService.transferField(fromParent, toParent, formIndex, toIndex);
        this.formlyFormService.syncFormilyForm(this);
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
