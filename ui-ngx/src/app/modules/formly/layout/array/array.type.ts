import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { FormEditorService } from '@src/app/core/services/form-editor.service';
import { deepClone } from '@src/app/core/utils';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'formly-field-array',
  templateUrl: './array.type.html',
  styleUrls: ['./array.type.less'],
  imports: [
    MatIcon,
    CdkDrag,
    CdkDropList,
    FormlyModule,
    CdkDragHandle,
    MatButtonModule,
    CdkDragPlaceholder,
    ConcatUnitsPipe,
  ],
})
export class FormlyFieldArray extends FieldArrayType<IEditorFormlyField> implements OnInit {
  constructor(
    private toastr: ToastrService,
    private formEditorService: FormEditorService,
  ) {
    super();
  }

  cdkDropListDropped(event: CdkDragDrop<string[]>) {
    this.formEditorService.moveField(this.model, event.previousIndex, event.currentIndex);
    this.options.build!();
  }

  addField(toIndex: number) {
    let defaultAddValue = this.field.props?.['defaultAddValue'];
    defaultAddValue && (defaultAddValue = deepClone(defaultAddValue));

    const value = deepClone(this.model.at(-1) || {});

    this.formEditorService.addField(defaultAddValue || value, this.model, toIndex, false);
    this.options.build!();
  }

  removeField(toIndex: number) {
    const canRemoveLast = this.field.props?.['canRemoveLast'] ?? true;
    // 如果不允许删除最后一列，且当前只有一列，则提示不能删除
    if (!canRemoveLast && this.model.length === 1) {
      this.toastr.warning('最后一列不能删除', '', {
        positionClass: 'toast-top-center',
      });
      return;
    }

    this.formEditorService.removeField(this.model, toIndex, false);
    this.options.build!();
  }

  getColumnItemWidth(fieldGroup: IEditorFormlyField[], itemField: IEditorFormlyField): string {
    const itemRow = itemField.props?.['row'] ?? 1;
    const totalRow = fieldGroup.reduce((acc, ori) => acc + (ori.props?.['row'] ?? 0), 0) || 1;
    return `calc(100% * ${itemRow / totalRow}) `;
  }

  ngOnInit() {}
}
