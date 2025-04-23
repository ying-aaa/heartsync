import { Component, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { HsDynamicTableComponent } from '@src/app/shared/components/hs-table/hs-dynamic-table.component';
import {
  ActionColumn,
  IDynamicTable,
  PageLink,
  TextColumn,
} from '@src/app/shared/components/hs-table/table.model';

@Component({
  selector: 'hs-app-manage',
  templateUrl: './app-manage.component.html',
  imports: [
    MatDividerModule,
    // HsTreeComponent,
    // HsFancytreeComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    HsDynamicTableComponent,
  ],
})
export class AppManageComponent implements OnInit {
  treeConfig = signal({});
  fileName = new FormControl('');

  tableConfig = signal(
    new IDynamicTable({
      pageLink: new PageLink(0, 10),
      selection: true,
      tableColumn: [
        new TextColumn('appName', '应用名称', 'auto'),
        new ActionColumn('actions', '操作', '', '', '', [
          {
            name: '编辑',
            icon: 'edit',
            action: (row, event) => {
              event.stopPropagation();
              console.log('编辑', row, event);
            },
          },
          {
            name: '删除',
            icon: 'delete',
            action: (row, event) => {
              console.log('删除', row, event);
            },
          },
        ]),
      ],
      layout: 'total, sizes, prev, pager, next, jumper',
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor() {}

  ngOnInit() {}
}
