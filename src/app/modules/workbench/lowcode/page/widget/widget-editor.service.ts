import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { generateUUID } from '@src/app/core/utils';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { presetResource } from '../../../components/preset-components/preset-resource';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WidgetEditorService {
  HS_DEFAULT_ID = 'workspace';

  // 是否编辑模式
  isEditMode = true;

  // 当前是否在拖拽中
  dragStart = false;

  // 连接项
  connectedTo = [];

  // 选中的 Field
  private activeField?: IEditorFormlyField;
  _fieldSelected$ = new Subject<IEditorFormlyField>();
  get fieldSelected$(): Observable<IEditorFormlyField> {
    return this._fieldSelected$.asObservable();
  }

  fields: IEditorFormlyField[] = [
    {
      key: 'col21',
      type: 'col',
      label: '列',
      fieldId: generateUUID(`${IFieldType.COL}_key_`),
      wrappers: ['col'], // 使用 col 包装器
      props: {},
      _design: true,
      fieldGroup: [
        {
          key: 'fieldset',
          type: 'fieldset',
          label: '组',
          fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
          wrappers: ['fieldset'], // 使用 fieldset 包装器
          props: {
            label: '身份信息',
          },
          fieldGroup: [
            {
              key: 'col1',
              type: 'col',
              label: '列',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'input1',
                  type: 'input',
                  label: '输入框',
                  fieldId: generateUUID(`input_key_`),
                  templateOptions: { label: 'Input 1' },
                  props: {
                    label: '请输入',
                  },
                },
                {
                  key: 'input2',
                  type: 'input',
                  label: '输入框',
                  fieldId: generateUUID(`input_key_`),
                  templateOptions: { label: 'Input 2' },
                },
              ],
              props: {},
            },
            {
              key: 'col1',
              type: 'col',
              label: '列',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'fieldset',
                  type: 'fieldset',
                  fieldId: generateUUID(`${IFieldType.GROUP}_key_`),
                  wrappers: ['fieldset'], // 使用 fieldset 包装器
                  props: {
                    label: '身份信息',
                  },
                  fieldGroup: [
                    {
                      key: 'col1',
                      type: 'col',
                      fieldId: generateUUID(`${IFieldType.COL}_key_`),
                      wrappers: ['col'], // 使用 col 包装器
                      fieldGroup: [
                        {
                          key: 'input1',
                          type: 'input',
                          fieldId: generateUUID(`input_key_`),
                          templateOptions: { label: 'Input 1' },
                        },
                      ],
                      props: {},
                    },
                    {
                      key: 'col2',
                      type: 'col',
                      fieldId: generateUUID(`${IFieldType.COL}_key_`),
                      wrappers: ['col'], // 使用 col 包装器
                      fieldGroup: [
                        {
                          key: 'input3',
                          type: 'input',
                          fieldId: generateUUID(`input_key_`),
                          templateOptions: { label: 'Input 3' },
                        },
                      ],
                      props: {},
                    },
                  ],
                },
              ],
              props: {},
            },

            {
              key: 'col2',
              type: 'col',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'input3',
                  type: 'input',
                  templateOptions: { label: 'Input 3' },
                  fieldId: generateUUID(`input_key_`),
                },
                {
                  key: 'input4',
                  type: 'input',
                  templateOptions: { label: 'Input 4' },
                  fieldId: generateUUID(`input_key_`),
                },
              ],
              props: {},
            },
          ],
        },
      ],
    },
  ];

  model = [];
  options = [];

  constructor() {}

  getConnectedTo(type: IFieldType) {
    const options = {
      group: [],
      col: [],
      row: [],
    };

    return findSameField(this.fields, options)[type];
  }

  isActiveField(fieldId: string) {
    return this.activeField?.fieldId === fieldId;
  }

  selectField(field: IEditorFormlyField): void {
    // const field = this.fieldMap.get(fieldId)!;
    this.activeField = field;
    this._fieldSelected$.next(field);
  }

  moveField(siblings: any, fromIndex: number, toIndex: number) {
    moveItemInArray(siblings, fromIndex, toIndex);
  }

  transferField(
    currentParent: any,
    targetParent: any,
    formIndex: number,
    toIndex: number,
  ) {
    transferArrayItem(currentParent, targetParent, formIndex, toIndex);
  }
}

function findSameField(
  fields: IEditorFormlyField[],
  options: { [key in IFieldType]: string[] },
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
  return options;
}
