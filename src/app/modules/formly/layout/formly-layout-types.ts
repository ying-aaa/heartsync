import { FormlyFieldAccordionComponent } from './accordion/formly-field-accordion.component';
import { FormlyFieldWrapperComponent } from './wrapper/formly-field-wrapper.component';
import { FormlyFieldFieldsetComponent } from './fieldset/formly-field-fieldset.component';
import { FormlyFieldGridComponent } from './grid/formly-field-grid.component';
import { FormlyFieldTabsComponent } from './tabs/formly-field-tabs.component';
import { FormlyFieldStepperComponent } from './stepper/formly-field-stepper.component';
import { FormlyFieldCanvasComponent } from './canvas/formly-field-canvas.component';
import { FormlyFieldArrayComponent } from './array/formly-field-array.component';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
const density = 1;

const densityExpressions = {
  className: (field: IEditorFormlyField) => {
    // 根据 props.density 的值动态计算 className
    return `hs-density--${field.props?.['density']}`;
  },
};

export const formlyLayoutTypes = [
  {
    name: 'column',
    component: FormlyFieldWrapperComponent,
    defaultOptions: {
      props: { density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'grid',
    component: FormlyFieldGridComponent,
    defaultOptions: {
      props: {
        density,
        styles: {
          gap: '10',
          gapUnits: 'px',
        },
      },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'flex',
    component: FormlyFieldWrapperComponent,
    defaultOptions: {
      props: { density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'fieldset',
    component: FormlyFieldFieldsetComponent,
    defaultOptions: {
      props: { density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'tabs',
    component: FormlyFieldTabsComponent,
    defaultOptions: {
      props: { density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'accordion',
    component: FormlyFieldAccordionComponent,
    defaultOptions: {
      props: { density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'mat-stepper',
    component: FormlyFieldStepperComponent,
    defaultOptions: {
      props: { density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'canvas',
    component: FormlyFieldCanvasComponent,
    defaultOptions: {
      props: { density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
  {
    name: 'array',
    component: FormlyFieldArrayComponent,
    defaultOptions: {
      props: { density },
      expressions: {
        ...densityExpressions,
      },
    },
  },
];
