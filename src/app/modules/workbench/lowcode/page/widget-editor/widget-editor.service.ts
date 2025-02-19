import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { generateUUID } from '@src/app/core/utils';
import {
  IEditorFormlyField,
  IFieldType,
} from '@src/app/shared/models/editor.model';
import { presetResource } from '../../../components/preset-components/preset-resource';

@Injectable({
  providedIn: 'root',
})
export class WidgetEditorService {
  HS_DEFAULT_ID = 'workspace';

  isEditMode = false;

  connectedTo = [];

  fields: IEditorFormlyField[] = [
    {
      key: 'col21',
      fieldId: generateUUID(`${IFieldType.COL}_key_`),
      wrappers: ['col'], // 使用 col 包装器
      props: {},
      fieldGroup: [
        {
          key: 'group',
          fieldId: generateUUID(`${IFieldType.GROUP}_key_`),

          wrappers: ['group'], // 使用 group 包装器
          props: {
            label: '身份信息',
          },
          fieldGroup: [
            {
              key: 'col1',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'input1',
                  type: 'input',
                  templateOptions: { label: 'Input 1' },
                },
                {
                  key: 'input2',
                  type: 'input',
                  templateOptions: { label: 'Input 2' },
                },
              ],
              props: {},
            },
            {
              key: 'group',
              fieldId: generateUUID(`${IFieldType.GROUP}_key_`),

              wrappers: ['group'], // 使用 group 包装器
              props: {
                label: '身份信息',
              },
              fieldGroup: [
                {
                  key: 'col1',
                  fieldId: generateUUID(`${IFieldType.COL}_key_`),
                  wrappers: ['col'], // 使用 col 包装器
                  fieldGroup: [
                    {
                      key: 'input1',
                      type: 'input',
                      templateOptions: { label: 'Input 1' },
                    },
                  ],
                  props: {},
                },
                {
                  key: 'col2',
                  fieldId: generateUUID(`${IFieldType.COL}_key_`),
                  wrappers: ['col'], // 使用 col 包装器
                  fieldGroup: [
                    {
                      key: 'input3',
                      type: 'input',
                      templateOptions: { label: 'Input 3' },
                    },
                    {
                      key: 'input4',
                      type: 'input',
                      templateOptions: { label: 'Input 4' },
                    },
                  ],
                  props: {},
                },
              ],
            },
            {
              key: 'col2',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'input3',
                  type: 'input',
                  templateOptions: { label: 'Input 3' },
                },
                {
                  key: 'input4',
                  type: 'input',
                  templateOptions: { label: 'Input 4' },
                },
                {
                  key: 'input3',
                  type: 'input',
                  templateOptions: { label: 'Input 3' },
                },
                {
                  key: 'input4',
                  type: 'input',
                  templateOptions: { label: 'Input 4' },
                },
              ],
              props: {},
            },
            {
              key: 'col3',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'input5',
                  type: 'input',
                  templateOptions: { label: 'Input 5' },
                },
                {
                  key: 'input6',
                  type: 'input',
                  templateOptions: { label: 'Input 6' },
                },
              ],
              props: {},
            },
          ],
        },
        {
          key: 'group',
          fieldId: generateUUID(`${IFieldType.GROUP}_key_`),

          wrappers: ['group'], // 使用 group 包装器
          props: {
            label: '身份信息',
          },
          fieldGroup: [
            {
              key: 'col1',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'input1',
                  type: 'input',
                  templateOptions: { label: 'Input 1' },
                },
                {
                  key: 'input2',
                  type: 'input',
                  templateOptions: { label: 'Input 2' },
                },
              ],
              props: {},
            },
            {
              key: 'col2',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'input3',
                  type: 'input',
                  templateOptions: { label: 'Input 3' },
                },
                {
                  key: 'input4',
                  type: 'input',
                  templateOptions: { label: 'Input 4' },
                },
                {
                  key: 'input3',
                  type: 'input',
                  templateOptions: { label: 'Input 3' },
                },
                {
                  key: 'input4',
                  type: 'input',
                  templateOptions: { label: 'Input 4' },
                },
              ],
              props: {},
            },
            {
              key: 'col3',
              fieldId: generateUUID(`${IFieldType.COL}_key_`),
              wrappers: ['col'], // 使用 col 包装器
              fieldGroup: [
                {
                  key: 'input5',
                  type: 'input',
                  templateOptions: { label: 'Input 5' },
                },
                {
                  key: 'input6',
                  type: 'input',
                  templateOptions: { label: 'Input 6' },
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

  constructor() {
    setTimeout(() => {
      this.getConnectedTo(IFieldType.COL);
    }, 500);
  }

  getConnectedTo(type: IFieldType) {
    const options = {
      group: [],
      col: [],
      row: [],
    };

    return as(this.fields, options)[type];
  }
}

function as(
  fields: IEditorFormlyField[],
  options: { [key in IFieldType]: string[] },
): { [key in IFieldType]: string[] } {
  for (let i = 0; i < fields.length; i++) {
    const type = fields[i].wrappers?.[0] as IFieldType;
    if (type && options[type]) {
      options[type].unshift(fields[i].fieldId as string);
    }
    if (fields[i].fieldGroup) {
      options = as(fields[i].fieldGroup as IEditorFormlyField[], options);
    }
  }
  return options;
}
