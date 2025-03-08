import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

const appearance = 'outline';
const density = 5;

const baseProps = {
  appearance, // 输入类型
  density, // 密度
  placeholder: '',
  description: '',
  disabled: false,
  required: false,
  readonly: false,
};

const densityExpressions = {
  className: (field: IEditorFormlyField) => {
    const densityClassName = `hs-density--${field.props?.['density']} `;
    return field.className
      ? field.className.replace(/hs-density.*?\s/, densityClassName)
      : densityClassName;
  },
};

export const formlyFormTypes = [
  {
    name: 'input',
    type: 'input',
    defaultOptions: {
      props: {
        ...baseProps,
        label: '单行文本',
        maxLength: undefined,
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'textarea',
    defaultOptions: {
      props: {
        typeName: '多行文本',
        label: '多行文本',
        rows: 4,
        maxLength: undefined,
        ...baseProps,
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'input',
    type: 'number',
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '数字',
        label: '数字',
        min: 0,
        max: undefined,
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'input',
    type: 'password',
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '密码',
        label: '密码',
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'datepicker',
    defaultOptions: {
      props: {
        typeName: '日期',
        label: '日期',
        ...baseProps,
        dateFormat: 'yyyy-MM-dd', // 设置日期格式
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'radio',
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '单选',
        label: '单选',
        options: [
          { value: 1, label: '选项 1' },
          { value: 2, label: '选项 2' },
          { value: 3, label: '选项 3' },
          { value: 4, label: '选项 4', disabled: true },
        ],
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'checkbox',
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '多选',
        label: '多选',
        options: [
          { value: 1, label: '选项 1' },
          { value: 2, label: '选项 2' },
          { value: 3, label: '选项 3' },
          { value: 4, label: '选项 4', disabled: true },
        ],
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'toggle',
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '开关',
        label: '开关',
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'slider',
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '滑块',
        label: '滑块',
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'select',
    type: 'select',
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '下拉',
        label: '下拉选择',
        options: [
          { value: 1, label: '选项 1' },
          { value: 2, label: '选项 2' },
          { value: 3, label: '选项 3' },
          { value: 4, label: '选项 4', disabled: true },
        ],
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
];
