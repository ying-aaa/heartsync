import { FormlyMatAccordionWrapperComponent } from './formly-mat-accordion-wrapper/formly-mat-accordion-wrapper.component';
import { FormlyColumnWrapperComponent } from './formly-column-wrapper/formly-column-wrapper.component';
import { FormlyFieldsetWrapperComponent } from './formly-fieldset-wrapper/formly-fieldset-wrapper.component';
import { FormlyGridWrapperComponent } from './formly-grid-wrapper/formly-grid-wrapper.component';
import { FormlyMatTabsWrapperComponent } from './formly-mat-tabs-wrapper/formly-mat-tabs-wrapper.component';
import { FormlyMatStepperWrapperComponent } from './formly-mat-stepper-wrapper/formly-mat-stepper-wrapper.component';
import { FormlyCanvasWrapperComponent } from './formly-canvas-wrapper/formly-canvas-wrapper.component';

export const formlyLayoutTypes = [
  { name: 'column', component: FormlyColumnWrapperComponent },
  { name: 'grid', component: FormlyGridWrapperComponent },
  { name: 'fieldset', component: FormlyFieldsetWrapperComponent },
  { name: 'mat-tabs', component: FormlyMatTabsWrapperComponent },
  { name: 'mat-accordion', component: FormlyMatAccordionWrapperComponent },
  { name: 'mat-stepper', component: FormlyMatStepperWrapperComponent },
  { name: 'canvas', component: FormlyCanvasWrapperComponent },
];
