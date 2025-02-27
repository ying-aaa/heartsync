import { Component } from '@angular/core';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'formly-scroll-wrapper',
  template: ` <ng-scrollbar
    class="wh-full min-h-30px"
    #scrollbarRef="ngScrollbar"
    externalViewport
    visibility="hover"
    appearance="compact"
    orientation="auto"
    (afterInit)="onScrollbarUpdate(scrollbarRef)"
    (afterUpdate)="onScrollbarUpdate(scrollbarRef, 200)"
  >
    <div scrollViewport>
      <ng-container #fieldComponent></ng-container>
    </div>
  </ng-scrollbar>`,
  imports: [NgScrollbarModule, FormlyModule],
})
export class FormlyScrollWrapperComponent extends FieldWrapper<IEditorFormlyField> {
  constructor() {
    super();
  }

  onScrollbarUpdate(scrollbarRef: NgScrollbarExt, duration: number = 0): void {
    scrollbarRef.scrollTo({ bottom: 0, duration });
  }
}
