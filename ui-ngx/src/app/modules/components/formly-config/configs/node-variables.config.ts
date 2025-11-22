import { IEditorFormlyField } from '@src/app/shared/models/public-api';

export const variables_config: IEditorFormlyField[] = [
  {
    type: 'tabs',
    props: {
      label: '页签',
      icon: 'tab',
      placeholder: '',
      disabled: false,
      density: 1,
    },
    className: 'hs-density--1',
    fieldGroup: [
      {
        type: 'column',
        props: {
          label: '变量定义',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [
          {
            key: 'variableName',
            type: 'input',
            fieldId: 'input_key_2579558739748954',
            props: {
              label: '变量名',
              typeName: '单行文本',
              icon: 'text_fields',
              row: 1,
              placeholder: '请输入变量名',
              disabled: false,
              appearance: 'outline',
            },
            className: 'hs-density--5',
          },
          {
            key: 'getValueType',
            type: 'radio',
            fieldId: 'input_key_3723456456347834',
            defaultValue: 'custom',
            props: {
              label: '取值类型',
              typeName: '单行文本',
              icon: 'text_fields',
              row: 1,
              placeholder: '请选择取值类型',
              disabled: false,
              appearance: 'outline',
              options: [
                {
                  label: "自定义",
                  value: "custom"
                },
                {
                  label: "系统",
                  value: "system"
                },
                {
                  label: "资产",
                  value: "assets"
                },
                {
                  label: "路由",
                  value: "route"
                }
              ],
            },
            className: 'hs-density--5',
          },
          // 自定义变量，
          {
            key: 'variableType',
            type: 'select',
            fieldId: 'input_key_3723456456347834',
            defaultValue: 'string',
            props: {
              label: '变量类型',
              typeName: '单行文本',
              icon: 'text_fields',
              row: 1,
              placeholder: '请选择变量类型',
              disabled: false,
              appearance: 'outline',
              options: [
                {
                  label: "字符串",
                  value: "string"
                },
                {
                  label: "数值",
                  value: "number"
                },
                {
                  label: "布尔",
                  value: "boolean"
                },
                {
                  label: "日期",
                  value: "date"
                },
                {
                  label: "日期时间",
                  value: "datetime"
                },
                {
                  label: "对象",
                  value: "object"
                },
                {
                  label: "单值数组",
                  value: "singleArray"
                },
                {
                  label: "对象数组",
                  value: "objectArrat"
                }
              ],
            },
            className: 'hs-density--5',
          },
          {
            key: 'variableValue',
            type: 'input',
            fieldId: 'input_key_2579558739748954',
            props: {
              label: '变量值',
              typeName: '单行文本',
              icon: 'text_fields',
              row: 1,
              placeholder: '变量值',
              disabled: false,
              appearance: 'outline',
            },
            className: 'hs-density--5',
          },
          {
            key: 'variableValue',
            type: 'json-object',
            fieldId: 'input_key_2579558739748954',
            props: {
              label: '变量值',
              typeName: '单行文本',
              icon: 'text_fields',
              row: 1,
              placeholder: '变量值',
              disabled: false,
              appearance: 'outline',
              styles: {
                height: 200,
                heightUnits: "px",
                border: '1px solid var(--base-color-10)',
                borderRadius: 8,
                borderRadiusUnits: 'px',
                overflow: "hidden"
              },
              title: "值"
            },
            className: 'hs-density--5',
            expressions: {
              'props.title': (field: IEditorFormlyField) => {
                const componentType = field.model?.variableType;
                return componentType + "值";
              },
            },
          },
        ],
      },
      {
        type: 'column',
        props: {
          label: '变量计算',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [],
      },
      {
        key: '变量修改',
        type: 'column',
        props: {
          label: '变量修改',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [],
      },
      {
        key: '变量自定义',
        type: 'column',
        props: {
          label: '变量自定义',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [],
      },
    ],
  },
];
