import { Component, OnInit } from '@angular/core';
// panel-wrapper.component.ts
import // CdkDrag,
// CdkDragDrop,
// CdkDragPlaceholder,
// CdkDropList,
// CdkDropListGroup,
'@angular/cdk/drag-drop';
import { FieldType, FieldWrapper, FormlyModule } from '@ngx-formly/core';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { WidgetEditorService } from '@app/modules/workbench/lowcode/page/widget/widget-editor.service';

@Component({
  selector: 'folmly-fieldset-wrapper',
  templateUrl: './folmly-fieldset-wrapper.component.html',
  styleUrls: ['./folmly-fieldset-wrapper.component.less'],
  imports: [
    // CdkDragPlaceholder,
    // CdkDropList, CdkDrag,
    FormlyModule,
  ],
})
export class FolmlyFieldsetWrapperComponent extends FieldType<IEditorFormlyField> {
  IFieldType = IFieldType;

  constructor(public widgetEditorService: WidgetEditorService) {
    super();
  }
}
