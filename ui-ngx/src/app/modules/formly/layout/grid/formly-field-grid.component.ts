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
} from '@src/app/shared/models/widget.model';
import { FormEditorService } from '@src/app/modules/page/design/page/widget/form-editor.service';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'formly-field-grid',
  templateUrl: './formly-field-grid.component.html',
  styleUrls: ['./formly-field-grid.component.less'],
  imports: [
    // CdkDragPlaceholder,
    // CdkDropList, CdkDrag,
    FormlyModule,
    ConcatUnitsPipe,
    CommonModule,
  ],
})
export class FormlyFieldGridComponent extends FieldType<IEditorFormlyField> {
  IFieldType = IFieldType;

  constructor(public formEditorService: FormEditorService) {
    super();
  }

  getGridTemplateColumns(fieldGroup: IEditorFormlyField[]) {
    return fieldGroup.reduce(
      (acc, ori) => acc + ` minmax(0px, ${ori.props?.['row']}fr)`,
      '',
    );
  }
}
