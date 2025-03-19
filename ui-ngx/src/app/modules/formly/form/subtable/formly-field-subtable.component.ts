import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldArrayType, FieldType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
export interface PeriodicElement {}

@Component({
  selector: 'formly-field-subtable',
  templateUrl: './formly-field-subtable.component.html',
  styleUrls: ['./formly-field-subtable.component.less'],
  imports: [
    MatButtonModule,
    MatTableModule,
    FormlyModule,
    MatIconModule,
    MatDividerModule,
  ],
})
export class FormlyFieldSubTableComponent
  extends FieldArrayType<IEditorFormlyField>
  implements OnInit
{
  constructor() {
    super();
  }
  columns: any = [];

  ngOnInit() {
    this.columns = this.field.fieldArray.fieldGroup!.map((item: any) => {
      return {
        th: item.props?.label,
        td: item.key,
      };
    });
  }

  removalLabel(field: IEditorFormlyField) {
    field.props!.label = '';
    field.props!['appearance'] = 'outline';
    return field;
  }
}
