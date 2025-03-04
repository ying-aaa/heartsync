import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

export const widget_input_config: IEditorFormlyField[] = [
  {
    type: 'tabs',
    props: {
      label: '页签',
      icon: 'tab',
      placeholder: '',
      disabled: false,
      density: 1,
    },
    className: 'hs-density--1 mat-tab-item3-full',
    fieldGroup: [
      {
        type: 'column',
        props: {
          label: '外观',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [
          {
            key: 'props.label',
            type: 'input',
            props: {
              type: 'text',
              label: '标题',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
            },
            className: 'hs-density--5',
          },
          {
            key: 'props.density',
            type: 'number',
            props: {
              label: '密度',
              appearance: 'outline',
              min: 0,
              max: 5,
            },
            className: 'hs-density--5',
          },
          {
            key: 'props.appearance',
            type: 'radio',
            props: {
              appearance: 'outline',
              label: '样式类型',
              options: [
                { value: 'fill', label: '填满' },
                { value: 'outline', label: '线条' },
              ],
            },
            className: 'hs-density--5',
          },
          {
            key: 'props.placeholder',
            type: 'input',
            props: {
              type: 'text',
              label: '提示',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
            },
            className: 'hs-density--5',
          },
        ],
      },
      {
        key: '092453673136',
        type: 'column',
        props: {
          label: '数据',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [
          {
            key: '398921920411',
            type: 'input',
            props: {
              type: 'text',
              label: '组件ID',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
            },
            className: 'hs-density--5',
          },
          {
            key: '504225693017',
            type: 'select',
            props: {
              label: '下拉单选',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
              multiple: true,
              selectAllOption: '选择全部',
              options: [
                {
                  value: 1,
                  label: '选项 1',
                },
                {
                  value: 2,
                  label: '选项 2',
                },
                {
                  value: 3,
                  label: '选项 3',
                },
                {
                  value: 4,
                  label: '选项 4',
                  disabled: true,
                },
              ],
            },
            className: 'hs-density--5',
          },
        ],
      },
      {
        key: '949865101136',
        type: 'column',
        props: {
          label: '交互',
          placeholder: '',
          disabled: false,
          density: 1,
        },
        className: 'hs-density--1',
        fieldGroup: [
          {
            key: '356800710424',
            type: 'input',
            props: {
              label: '第三个文本',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
              type: 'password',
            },
            className: 'hs-density--5',
          },
          {
            key: '798540614610',
            type: 'checkbox',
            props: {
              label: '多选',
              placeholder: '',
              disabled: false,
              appearance: 'outline',
              density: 5,
              description: '',
              required: false,
              readonly: false,
              options: [
                {
                  value: 1,
                  label: '选项 1',
                },
                {
                  value: 2,
                  label: '选项 2',
                },
                {
                  value: 3,
                  label: '选项 3',
                },
                {
                  value: 4,
                  label: '选项 4',
                  disabled: true,
                },
              ],
              hideFieldUnderline: true,
              indeterminate: true,
              floatLabel: 'always',
              hideLabel: true,
              color: 'accent',
            },
            className: 'hs-density--5',
          },
        ],
      },
    ],
  },
];
