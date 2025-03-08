import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldType } from '@ngx-formly/core';
import { IEditorFormlyField } from '@src/app/shared/models/editor.model';
import { MatTableModule } from '@angular/material/table';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
];

@Component({
  selector: 'formly-field-subtable',
  templateUrl: './formly-field-subtable.component.html',
  styleUrls: ['./formly-field-subtable.component.less'],
  imports: [MatButtonModule, MatTableModule],
})
export class FormlyFieldSubTableComponent
  extends FieldType<IEditorFormlyField>
  implements OnInit
{
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  constructor() {
    super();
  }

  ngOnInit() {}
}
