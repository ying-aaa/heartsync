import { FormlyFieldMatAccordionComponent } from './formly-field-mat-accordion/formly-field-mat-accordion.component';
import { FormlyFieldWrapperComponent } from './formly-field-wrapper/formly-field-wrapper.component';
import { FormlyFieldFieldsetComponent } from './formly-field-fieldset/formly-field-fieldset.component';
import { FormlyFieldGridComponent } from './formly-field-grid/formly-field-grid.component';
import { FormlyFieldMatTabsComponent } from './formly-field-mat-tabs/formly-field-mat-tabs.component';
import { FormlyFieldMatStepperComponent } from './formly-field-mat-stepper/formly-field-mat-stepper.component';
import { FormlyFieldCanvasComponent } from './formly-field-canvas/formly-field-canvas.component';
import { FormlyFieldArrayComponent } from './formly-field-array/formly-field-array.component';

export const formlyLayoutTypes = [
  { name: 'column', component: FormlyFieldWrapperComponent },
  { name: 'grid', component: FormlyFieldGridComponent },
  { name: 'flex', component: FormlyFieldWrapperComponent },
  { name: 'fieldset', component: FormlyFieldFieldsetComponent },
  { name: 'mat-tabs', component: FormlyFieldMatTabsComponent },
  { name: 'mat-accordion', component: FormlyFieldMatAccordionComponent },
  { name: 'mat-stepper', component: FormlyFieldMatStepperComponent },
  { name: 'canvas', component: FormlyFieldCanvasComponent },
  { name: 'array', component: FormlyFieldArrayComponent },
];
