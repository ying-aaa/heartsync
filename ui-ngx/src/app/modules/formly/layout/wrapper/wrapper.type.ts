// panel-wrapper.component.ts
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, HostListener, ViewChild } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import {
  ICdkDrapActionType,
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';
import { CommonModule } from '@angular/common';
import { ConcatUnitsPipe } from '@shared/pipes/units.pipe';
import { FormlyFormService } from '../../formly-form.service';

@Component({
  selector: 'formly-field-wrapper',
  templateUrl: './wrapper.type.html',
  styleUrls: ['./wrapper.type.less'],
  host: { '[class.formly-field-wrapper]': 'true' },
  imports: [CdkDropList, CdkDrag, FormlyModule, CdkDragPlaceholder, CommonModule, ConcatUnitsPipe],
})
export class FormlyFieldWrapper extends FieldType<IEditorFormlyField> {
  @ViewChild(CdkDropList) dropList!: CdkDropList;

  IFieldType = IFieldType;
  constructor(private formlyFormService: FormlyFormService) {
    super();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.options.formState.mousePosition) return;
    this.options.formState.mousePosition.x = event.clientX;
    this.options.formState.mousePosition.y = event.clientY;
  }

  canEnter = (drag: CdkDrag) => {
    const isInDropContainer = this._isMouseInElement(drag.dropContainer.element.nativeElement);
    const index = this.options.formState
      .getConnectedTo(this.IFieldType.COLUMN)
      .indexOf(this.dropList.id);
    const dropContainerIndex = this.options.formState
      .getConnectedTo(this.IFieldType.COLUMN)
      .indexOf(drag.dropContainer.id);
    return !(isInDropContainer && dropContainerIndex < index);
  };

  cdkDropListDropped(event: CdkDragDrop<IEditorFormlyField[]> | any) {
    if (!event.item.data) return;
    const { action, field } = event.item.data;
    const fromParent: IEditorFormlyField[] = event.previousContainer.data;
    const toParent: IEditorFormlyField[] = event.container.data;
    const toParentFieldId: string = event.container.id;
    const { previousIndex: formIndex, currentIndex: toIndex } = event;

    if (action === ICdkDrapActionType.COPY) {
      const newField = this.formlyFormService.addField(field, toParent, toIndex);
      this.formlyFormService.syncFormilyForm(this);
      this.options.formState.selectField && this.options.formState.selectField(newField);
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
  }

  getDragFieldData = (field: IEditorFormlyField) => ({
    action: ICdkDrapActionType.MOVE,
    field,
  });

  private _isMouseInElement(droplistElement: HTMLElement): boolean {
    const rect: DOMRect = droplistElement.getBoundingClientRect();
    const { x, y } = this.options.formState.mousePosition;
    const isInWidth = x >= rect.left && x <= rect.right;
    const isInHeight = y >= rect.top && y <= rect.bottom;
    return isInWidth && isInHeight;
  }
}
