import { Component } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/widget.model';
import { FormEditorService } from '@src/app/core/services/form-editor.service';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'formly-field-grid',
  templateUrl: './grid.type.html',
  styleUrls: ['./grid.type.less'],
  imports: [
    FormlyModule,
    ConcatUnitsPipe,
    CommonModule,
  ],
})
export class FormlyFieldGrid extends FieldType<IEditorFormlyField> {
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
