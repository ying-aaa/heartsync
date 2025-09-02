import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { FormlyFieldButton } from './button/button.type';

const appearance = 'outline';
const density = 4;

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

export const formlyDisplayTypes = [
  {
    name: 'button',
    component: FormlyFieldButton,
    defaultOptions: {
      props: {
        ...baseProps,
        typeName: '按钮',
        label: '按钮',
        type: 'basic',
        icon: 'visibility',
        styles: {
          width: '',
          widthUnits: 'px',
          fontSize: '14',
          fontSizeUnits: 'px',
          borderRadius: '8',
          borderRadiusUnits: 'px',
        },
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
];
