import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';
import { deepClone, generateUUID } from '@src/app/core/utils';
import { IEditorFormlyField, IFieldType } from '@src/app/shared/models/widget.model';

// 递归新的field为其添加id属性
function addFieldId(field: IEditorFormlyField) {
  const key = generateUUID();
  // 有一些外层容器不需要绑定key
  field.key = field._bindKey ? key : '';
  field.fieldId = `${field.type}_key_${key}`;

  if (field.fieldGroup) {
    field.fieldGroup.forEach(addFieldId);
  }
}

@Injectable({
  providedIn: 'root',
})
export class FormlyFormService {
  constructor() {}

  addField(
    field: IEditorFormlyField,
    toParentField: IEditorFormlyField[],
    toIndex: number,
    add?: FieldArrayType['add']
  ) {
    field = deepClone(field);

    if (field._design) {
      // 执行递归
      addFieldId(field);
    }

    // 新增 field 的默认row为1
    if (field.props) {
      field.props['row'] = 1;
    }

    // array type field 需要使用内部add方法
    add ? add(toIndex, field) : toParentField.splice(toIndex, 0, field);

    return field;
  }

  removeField(
    toParentField: IEditorFormlyField[],
    toIndex: number,
    remove?: FieldArrayType['remove'],
  ) {
    remove ? remove(toIndex) : toParentField.splice(toIndex, 1);
  }

  moveField(toParent: IEditorFormlyField[], fromIndex: number, toIndex: number) {
    moveItemInArray(toParent, fromIndex, toIndex);
  }

  transferField(
    fromParent: IEditorFormlyField[],
    toParent: IEditorFormlyField[],
    formIndex: number,
    toIndex: number,
  ) {
    // 执行移动
    transferArrayItem(fromParent, toParent, formIndex, toIndex);
  }

  syncFormilyForm(that: any) {
    that.options.formState.syncFormilyForm && that.options.formState.syncFormilyForm();
  }
}
