import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HsInlineEditorComponent } from './inline-editor/inline-editor.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

const inlineComponents: Type<any>[] = [
  HsInlineEditorComponent,

];

@NgModule({
  declarations: [...inlineComponents],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [...inlineComponents],
})
export class HsInlineEditorModule { }
