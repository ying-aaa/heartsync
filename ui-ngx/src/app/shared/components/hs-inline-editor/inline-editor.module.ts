import { forwardRef, NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HsInlineEditorComponent } from './inline-editor.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSlideToggle,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HsSwitchFormFieldComponent } from './hs-switch-form-field.component';

const inlineComponents: Type<any>[] = [HsInlineEditorComponent];

@NgModule({
  declarations: [HsSwitchFormFieldComponent, ...inlineComponents],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatProgressBarModule,
    MatIconModule,
  ],

  exports: [...inlineComponents],
})
export class HsInlineEditorModule {}
