import { FormlyFieldMatAccordionComponent } from './mat-accordion/formly-field-mat-accordion.component';
import { FormlyFieldWrapperComponent } from './wrapper/formly-field-wrapper.component';
import { FormlyFieldFieldsetComponent } from './fieldset/formly-field-fieldset.component';
import { FormlyFieldGridComponent } from './grid/formly-field-grid.component';
import { FormlyFieldMatTabsComponent } from './mat-tabs/formly-field-mat-tabs.component';
import { FormlyFieldMatStepperComponent } from './mat-stepper/formly-field-mat-stepper.component';
import { FormlyFieldCanvasComponent } from './canvas/formly-field-canvas.component';
import { FormlyFieldArrayComponent } from './array/formly-field-array.component';

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
