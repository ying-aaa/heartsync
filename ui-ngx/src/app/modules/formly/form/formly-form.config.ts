import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { FormlyFieldSubTable } from './subtable/formly-field-subtable.component';
import { FormlyFieldColorPicker } from './color/color-picker.type';
import { FormlyFieldRichtext } from './richtext/richtext-eidtor.type';
import { FormlyFieldDraw } from './draw/draw.type';
import { FormlyFieldJsonObject } from './json-object/json-object.type';
import { FormlyFieldGridRadio } from './radio/radio.type';

const appearance = 'outline';
const density = 5;

const baseConfig = {
  wrappers: ['layout', 'form-field'],
};

const baseProps = {
  appearance, // 输入类型
  density, // 密度
  placeholder: '',
  description: '',
  disabled: false,
  required: false,
  readonly: false,
  layout: 'top',
  hideLabel: false,
};

const baseExpressions = {
  className: (field: IEditorFormlyField) => {
    // 1. 定义密度类名的正则（精准匹配 hs-density--xxx 格式，忽略前后空格）
    const densityRegex = /\bhs-density--[^\s]+\b/g;
    // 2. 获取新的密度类名（确保有值，避免空类名）
    const newDensityClassName = field.props?.['density']
      ? `hs-density--${field.props['density']}`
      : '';

    // 3. 处理原有 className：移除所有旧的密度类名
    const cleanedClassName = field.className
      ? field.className.replace(densityRegex, '').trim()
      : '';

    // 4. 拼接最终类名（避免多余空格）
    const finalClassNames = [cleanedClassName, newDensityClassName]
      .filter(Boolean) // 过滤空字符串
      .join(' ');

    return finalClassNames;
  },
  'props.hideLabel': (field: IEditorFormlyField) => {
    const shouldHide = field.props?.['layout'] !== 'float';
    return shouldHide;
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
        ...baseExpressions,
      },
    },
    ...baseConfig,
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
        ...baseExpressions,
      },
    },
    ...baseConfig,
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
        ...baseExpressions,
      },
      className: 'mat-field-number ',
    },
    ...baseConfig,
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
        ...baseExpressions,
      },
    },
    ...baseConfig,
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
        ...baseExpressions,
      },
    },
    ...baseConfig,
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
        ],
      },
      expressions: {
        ...baseExpressions,
        wrappers: (field: IEditorFormlyField) => {
          const shouldHide = field.props?.['layout'] !== 'float';
          if (shouldHide) {
            return field.wrappers?.filter((wrapper) => wrapper !== 'form-field');
          }
          if (field.wrappers?.includes('form-field')) {
            return field.wrappers;
          }
          return [...field.wrappers!, 'form-field'];
        },
      },
    },
    ...baseConfig,
  },
  {
    name: 'grid-radio',
    component: FormlyFieldGridRadio,
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '单选',
        label: '单选',
        options: [
          { value: 1, label: '选项 1' },
          { value: 2, label: '选项 2' },
        ],
      },
    },
    wrappers: ['layout'],
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
        ...baseExpressions,
        wrappers: (field: IEditorFormlyField) => {
          const shouldHide = field.props?.['layout'] !== 'float';
          if (shouldHide) {
            return field.wrappers?.filter((wrapper) => wrapper !== 'form-field');
          }
          if (field.wrappers?.includes('form-field')) {
            return field.wrappers;
          }
          return [...field.wrappers!, 'form-field'];
        },
      },
    },
    ...baseConfig,
  },
  {
    name: 'toggle',
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '开关',
        label: '开关',
        layout: 'left',
      },
      expressions: {
        ...baseExpressions,
        'props.hideLabel': 'true',
        wrappers: "['layout']",
      },
    },
    className: 'hide-toggle-label',
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
        ...baseExpressions,
      },
    },
    ...baseConfig,
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
          { value: 4, label: '选项 4' },
        ],
      },
      expressions: {
        ...baseExpressions,
      },
    },
    ...baseConfig,
  },
  {
    name: 'subtable',
    component: FormlyFieldSubTable,
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '普通输入子表',
        label: '普通输入子表',
      },
      expressions: {
        ...baseExpressions,
      },
    },
  },
  {
    name: 'run-subtable',
    component: FormlyFieldSubTable,
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '普通输入子表',
        label: '普通输入子表',
      },
      expressions: {
        ...baseExpressions,
      },
    },
  },
  {
    name: 'color-picker',
    component: FormlyFieldColorPicker,
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '颜色选择器',
        label: '颜色选择器',
      },
      expressions: {
        ...baseExpressions,
      },
    },
    wrappers: ['layout'],
  },
  {
    name: 'richtext',
    component: FormlyFieldRichtext,
    // wrappers: ['form-field'],
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '富文本',
        label: '富文本',
      },
      expressions: {
        ...baseExpressions,
      },
    },
    wrappers: ['layout'],
  },
  {
    name: 'draw',
    component: FormlyFieldDraw,
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '签名',
        label: '签名',
      },
      expressions: {
        ...baseExpressions,
      },
    },
    wrappers: ['layout'],
  },
  {
    name: 'json-object',
    component: FormlyFieldJsonObject,
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: 'json编辑器',
        label: 'json编辑器',
      },
      expressions: {
        ...baseExpressions,
      },
    },
    wrappers: ['layout'],
  },
];
