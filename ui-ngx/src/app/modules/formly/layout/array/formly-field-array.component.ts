import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { WidgetEditorService } from '@src/app/modules/workbench/lowcode/page/widget/widget-editor.service';
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
    MatIcon,
    MatButtonModule,
  ],
})
export class FormlyFieldArrayComponent
  extends FieldArrayType<IEditorFormlyField>
  implements OnInit
{
  constructor(private widgetEditorService: WidgetEditorService) {
    super();
  }

  cdkDropListDropped(event: CdkDragDrop<string[]>) {
    this.widgetEditorService.moveField(
      this.model,
      event.previousIndex,
      event.currentIndex,
    );
    this.options.build!();
  }

  addField(toIndex: number) {
    this.widgetEditorService.addField(
      this.model.at(-1),
      this.model,
      toIndex,
      false,
    );
    this.options.build!();
  }

  removeField(toIndex: number) {
    this.widgetEditorService.removeField(this.model, toIndex, false);
    this.options.build!();
  }

  ngOnInit() {}
}
