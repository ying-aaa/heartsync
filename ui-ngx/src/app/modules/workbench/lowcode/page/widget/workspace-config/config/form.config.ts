import {
  IEditorFormlyField,
  IEditSizeType,
} from '@src/app/shared/models/widget.model';

export const widget_form_config: IEditorFormlyField[] = [
  {
    key: 'workSizeConfig.type',
    type: 'radio',
    props: {
      label: '预览设备尺寸',
      typeName: '单选',
      placeholder: '',
      disabled: false,
      appearance: 'outline',
      density: 5,
      description: '',
      required: false,
      readonly: false,
      options: [
        {
          value: IEditSizeType.FILL,
          label: '撑满',
        },
        {
          value: IEditSizeType.MOBILE,
          label: '手机',
        },
        {
          value: IEditSizeType.IPAD,
          label: '平板',
        },
        {
          value: IEditSizeType.PC,
          label: '电脑',
        },
        {
          value: IEditSizeType.CUSTOM,
          label: '自定义',
        },
      ],
      hideFieldUnderline: true,
      floatLabel: 'always',
      tabindex: -1,
    },
    className: 'hs-density--5 ',
  },
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
        ],
      },
      {
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
            key: 'id',
            type: 'input',
            props: {
              type: 'text',
              label: '表单id',
              placeholder: '',
              disabled: true,
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
