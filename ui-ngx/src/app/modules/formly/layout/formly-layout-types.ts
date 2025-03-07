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
    const densityClassName = `hs-density--${field.props?.['density']} `;
    return field.className
      ? field.className.replace(/hs-density.*?\s/, densityClassName)
      : densityClassName;
  },
};

export const formlyLayoutTypes = [
  {
    name: 'column',
    component: FormlyFieldWrapperComponent,
    defaultOptions: {
      props: {
        density,
        styles: {
          rowGap: 8,
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
    component: FormlyFieldGridComponent,
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
    component: FormlyFieldWrapperComponent,
    defaultOptions: {
      props: {
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
    component: FormlyFieldFieldsetComponent,
    defaultOptions: {
      props: {
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
          borderColor: '#ccc',
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
