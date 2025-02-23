import { Injectable, signal } from '@angular/core';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import {
  deepClone,
  generateUUID,
  getRecursivePosition,
} from '@src/app/core/utils';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';

@Injectable({
  providedIn: 'root',
})
export class WidgetEditorService {
  HS_DEFAULT_ID = 'workspace';

  // 是否编辑模式
  isEditMode = signal(true);

  mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  // 当前是否在拖拽中
  dragStart = false;

  // 选中的 Field
  private activeField?: IEditorFormlyField;
  _fieldSelected$ = new Subject<IEditorFormlyField>();
  get fieldSelected$(): Observable<IEditorFormlyField> {
    return this._fieldSelected$.asObservable();
  }

  fields = signal<IEditorFormlyField[]>([]);
  formGroup = new FormGroup({});
  model = {};
  options = {};

  constructor() {}

  getConnectedTo(type: IFieldType) {
    const options: any = {
      group: [],
      column: [this.HS_DEFAULT_ID],
      row: [],
    };

    // @ts-ignore
    return this.isEditMode()
      ? findSameField(this.fields(), options)[type]
      : options;
  }

  getSpecifyFields(fieldId: string) {
    return flatField(this.fields()).find((item) => item.fieldId === fieldId);
  }

  isActiveField(fieldId: string) {
    return this.activeField?.fieldId === fieldId;
  }

  selectField(field: IEditorFormlyField): void {
    this.activeField = field;
    this._fieldSelected$.next(field);
  }

  addField(
    field: IEditorFormlyField,
    toParentFieldId: string,
    toIndex: number,
  ) {
    field = deepClone(field);
    function addFieldId(field: IEditorFormlyField) {
      field.key = generateUUID();
      field.fieldId = `${field.type}_key_${field.key}`;
      if (field.fieldGroup) {
        field.fieldGroup.forEach(addFieldId);
      }
    }
    addFieldId(field);
    this.fields.update((fields) => {
      fields = deepClone(fields);
      const fieldLocationStr = this.getFieldLocationStr(toParentFieldId);
      if (fieldLocationStr) {
        const resData = new Function('fields', fieldLocationStr as string)(
          fields,
        );
        resData.splice(toIndex, 0, field);
      } else {
        fields.splice(toIndex, 0, field);
      }
      return fields;
    });

    this.selectField(field);
  }

  removeField(toParentFieldId: string, toIndex: number) {
    this.fields.update((fields) => {
      fields = deepClone(fields);
      const fieldLocationStr = this.getFieldLocationStr(toParentFieldId);
      if (fieldLocationStr) {
        const resData = new Function('fields', fieldLocationStr as string)(
          fields,
        );
        resData.splice(toIndex, 1);
      } else {
        fields.splice(toIndex, 1);
      }
      return fields;
    });
    this.activeField = undefined;
  }

  moveField(
    toParent: IEditorFormlyField[],
    fromIndex: number,
    toIndex: number,
  ) {
    moveItemInArray(toParent, fromIndex, toIndex);
  }

  transferField(
    formParent: IEditorFormlyField[],
    toParent: IEditorFormlyField[],
    formIndex: number,
    toIndex: number,
  ) {
    transferArrayItem(formParent, toParent, formIndex, toIndex);
  }

  getFieldLocationStr(toParentFieldId: string) {
    const fieldLocationArr = getRecursivePosition<IEditorFormlyField>(
      this.fields(),
      toParentFieldId,
      ['fieldGroup', 'fieldId'],
    )?.offset;
    if (fieldLocationArr) {
      // 通过堆内存的数据引用能力进行查询和操作
      const fieldLocationStr: string = fieldLocationArr.reduce(
        (res, ori) => res + `[${ori}].fieldGroup`,
        'return fields',
      );
      return fieldLocationStr;
    }
    return null;
  }
}

function findSameField(
  fields: IEditorFormlyField[],
  options: { [key in IFieldType]?: string[] },
): { [key in IFieldType]: string[] } {
  for (let i = 0; i < fields.length; i++) {
    const type = fields[i].type as IFieldType;
    if (type && options[type]) {
      options[type].unshift(fields[i].fieldId as string);
    }
    if (fields[i].fieldGroup) {
      options = findSameField(
        fields[i].fieldGroup as IEditorFormlyField[],
        options,
      );
    }
  }
  // @ts-ignore
  return options;
}

function flatField(field: IEditorFormlyField[]) {
  return field.reduce((acc, field) => {
    acc.push(field);
    if (field.fieldGroup) {
      acc.push(...flatField(field.fieldGroup));
    }
    return acc;
  }, [] as IEditorFormlyField[]);
}
