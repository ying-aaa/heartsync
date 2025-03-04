import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

@Component({
  selector: 'formly-field-canvas',
  templateUrl: './formly-field-canvas.component.html',
  styleUrls: ['./formly-field-canvas.component.less'],
  imports: [FormlyModule, CdkDrag],
})
export class FormlyFieldCanvasComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit() {}
}
