import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FieldType, FieldWrapper, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { MatTableModule } from '@angular/material/table';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'formly-field-subtable-item',
  templateUrl: './formly-field-subtable-item.component.html',
  styleUrls: ['./formly-field-subtable-item.component.less'],
  imports: [FormlyModule, MatButtonModule, MatTableModule],
})
export class FormlyFieldSubTableItemComponent
  extends FieldWrapper<IEditorFormlyField>
  implements OnInit
{
  ngOnInit(): void {}
}
