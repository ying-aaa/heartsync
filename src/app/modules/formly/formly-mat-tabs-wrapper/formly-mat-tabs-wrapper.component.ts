import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';

@Component({
  selector: 'formly-mat-tabs-wrapper',
  templateUrl: './formly-mat-tabs-wrapper.component.html',
  styleUrls: ['./formly-mat-tabs-wrapper.component.less'],
  imports: [MatTabsModule, FormlyModule],
})
export class FormlyMatTabsWrapperComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit() {}
}
