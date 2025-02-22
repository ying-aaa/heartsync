import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

@Component({
  selector: 'formly-canvas-wrapper',
  templateUrl: './formly-canvas-wrapper.component.html',
  styleUrls: ['./formly-canvas-wrapper.component.less'],
  imports: [FormlyModule, CdkDrag],
})
export class FormlyCanvasWrapperComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit() {}
}
