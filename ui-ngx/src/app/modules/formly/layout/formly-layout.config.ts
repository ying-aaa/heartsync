import { FormlyFieldAccordion } from './accordion/accordion.type';
import { FormlyFieldWrapper } from './wrapper/wrapper.type';
import { FormlyFieldFieldset } from './fieldset/fieldset.type';
import { FormlyFieldGrid } from './grid/grid.type';
import { FormlyFieldTabs } from './tabs/tabs.type';
import { FormlyFieldStepper } from './stepper/stepper.type';
import { FormlyFieldCanvas } from './canvas/canvas.type';
import { FormlyFieldArray } from './array/array.type';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { FormlyFieldSubTable } from './subtable/subtable.type';

const density = 1;

const densityExpressions = {
  className: (field: IEditorFormlyField) => {
    const densityClassName = `hs-density--${field.props?.['density']} `;
    return field.className
      ? field.className.replace(/hs-density.*?\s/, densityClassName)
      : densityClassName;
  },
};

export const formlyLayoutTypes = [
  {
    name: 'column',
    component: FormlyFieldWrapper,
    defaultOptions: {
      props: {
        density,
        typeName: '列',
        styles: {
          rowGap: 12,
          rowGapUnits: 'px',
        },
      },
      expressions: {
        ...densityExpressions,
        rowGap: (field: IEditorFormlyField) => {
          field.parent!.fieldGroup?.forEach((item) => {
            item.props!['styles'] = field.props!['styles'];
          });
        },
      },
    },
  },
  {
    name: 'grid',
    component: FormlyFieldGrid,
    defaultOptions: {
      props: {
        density,
        styles: {
          columnGap: 8,
          columnGapUnits: 'px',
        },
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'flex',
    component: FormlyFieldWrapper,
    defaultOptions: {
      props: {
        typeName: '弹性',
        density,
        orientation: 'mixed',
        styles: {
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          rowGap: 8,
          rowGapUnits: 'px',
          columnGap: 8,
          columnGapUnits: 'px',
          justifycontent: 'center',
          alignitems: 'center',
          paddingLeft: 8,
          paddingLeftUnits: 'px',
          paddingTop: 8,
          paddingTopUnits: 'px',
          paddingRight: 8,
          paddingRightUnits: 'px',
          paddingBottom: 8,
          paddingBottomUnits: 'px',
        },
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'fieldset',
    component: FormlyFieldFieldset,
    defaultOptions: {
      props: {
        typeName: '群组',
        density,
        showBorder: true,
        styles: {
          color: '',
          fontSize: 14,
          fontSizeUnits: 'px',
          fontWeight: 400,
          paddingLeft: 8,
          paddingLeftUnits: 'px',
          paddingTop: 8,
          paddingTopUnits: 'px',
          paddingRight: 8,
          paddingRightUnits: 'px',
          paddingBottom: 8,
          paddingBottomUnits: 'px',
          borderRadius: 8,
          borderRadiusUnits: 'px',
          borderColor: 'var(--mdc-outlined-text-field-outline-color)',
          borderWidth: 1,
          borderWidthUnits: 'px',
          borderStyle: 'groove',
        },
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'tabs',
    component: FormlyFieldTabs,
    defaultOptions: {
      props: { typeName: '页签', density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'accordion',
    component: FormlyFieldAccordion,
    defaultOptions: {
      props: { typeName: '手风琴', density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'mat-stepper',
    component: FormlyFieldStepper,
    defaultOptions: {
      props: { typeName: '步进器', density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'canvas',
    component: FormlyFieldCanvas,
    defaultOptions: {
      props: { typeName: '画布', density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'array',
    component: FormlyFieldArray,
    defaultOptions: {
      props: { typeName: '数组', density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'subtable',
    component: FormlyFieldSubTable,
    defaultOptions: {
      props: {
        typeName: '普通输入子表',
        label: '普通输入子表',
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
];
