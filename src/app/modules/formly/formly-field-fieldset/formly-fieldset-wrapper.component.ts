import { Component, OnInit } from '@angular/core';
// panel-wrapper.component.ts
// import {
//   CdkDrag,
//   CdkDragDrop,
//   CdkDragPlaceholder,
//   CdkDropList,
//   CdkDropListGroup,
// } from '@angular/cdk/drag-drop';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { WidgetEditorService } from '@app/modules/workbench/lowcode/page/widget/widget-editor.service';

@Component({
  selector: 'formly-fieldset-wrapper',
  templateUrl: './formly-fieldset-wrapper.component.html',
  styleUrls: ['./formly-fieldset-wrapper.component.less'],
  imports: [
    // CdkDragPlaceholder,
    // CdkDropList, CdkDrag,
    FormlyModule,
  ],
})
export class FormlyFieldsetWrapperComponent extends FieldType<IEditorFormlyField> {
  IFieldType = IFieldType;

  constructor(public widgetEditorService: WidgetEditorService) {
    super();
  }
}
