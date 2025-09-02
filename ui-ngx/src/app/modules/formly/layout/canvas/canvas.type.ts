import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';

@Component({
  selector: 'formly-field-canvas',
  templateUrl: './canvas.type.html',
  styleUrls: ['./canvas.type.less'],
  imports: [FormlyModule, CdkDrag],
})
export class FormlyFieldCanvas
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit() {}
}
