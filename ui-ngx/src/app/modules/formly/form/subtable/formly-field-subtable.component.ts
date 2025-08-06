import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/widget.model';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';

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
  columns: any = [];

  constructor() {
    super();
  }

  getSubTableItemWidth(
    fieldGroup: IEditorFormlyField[],
    itemField: IEditorFormlyField,
  ): string {
    const itemRow = itemField.props?.['row'] ?? 0;
    const totalRow = fieldGroup.reduce(
      (acc, ori) => acc + (ori.props?.['row'] ?? 0),
      0,
    );
    return (itemRow / totalRow) * 90 + '%';
  }

  removalLabel(field: IEditorFormlyField) {
    field.props!.label = '';
    field.props!['appearance'] = 'outline';
    return field;
  }

  ngOnInit() {
    this.columns = this.field.fieldArray.fieldGroup!.map((item: any) => {
      return {
        th: item.props?.label,
        td: item.key,
      };
    });
  }
}
