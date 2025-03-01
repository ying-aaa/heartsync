import { FormlyFieldAccordionComponent } from './accordion/formly-field-accordion.component';
import { FormlyFieldWrapperComponent } from './wrapper/formly-field-wrapper.component';
import { FormlyFieldFieldsetComponent } from './fieldset/formly-field-fieldset.component';
import { FormlyFieldGridComponent } from './grid/formly-field-grid.component';
import { FormlyFieldTabsComponent } from './tabs/formly-field-tabs.component';
import { FormlyFieldStepperComponent } from './stepper/formly-field-stepper.component';
import { FormlyFieldCanvasComponent } from './canvas/formly-field-canvas.component';
import { FormlyFieldArrayComponent } from './array/formly-field-array.component';

export const formlyLayoutTypes = [
  { name: 'column', component: FormlyFieldWrapperComponent },
  { name: 'grid', component: FormlyFieldGridComponent },
  { name: 'flex', component: FormlyFieldWrapperComponent },
  { name: 'fieldset', component: FormlyFieldFieldsetComponent },
  { name: 'tabs', component: FormlyFieldTabsComponent },
  { name: 'accordion', component: FormlyFieldAccordionComponent },
  { name: 'mat-stepper', component: FormlyFieldStepperComponent },
  { name: 'canvas', component: FormlyFieldCanvasComponent },
  { name: 'array', component: FormlyFieldArrayComponent },
];
