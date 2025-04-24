import { Component, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ActionColumn,
  IDynamicTable,
  PageLink,
  TextColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { HsDynamicTableModule } from '@src/app/shared/components/hs-table/hs-dynamic-table.module';
import { of } from 'rxjs';

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
    HsDynamicTableModule
  ],
})
export class AppManageComponent implements OnInit {
  treeConfig = signal({});
  fileName = new FormControl('');

  pageLink = new PageLink(0, 10);
  tableConfig = signal(
    new IDynamicTable({
      pageLink: this.pageLink,
      selection: true,
      multipleFiled: 'appName',
      tableColumn: [
        new TextColumn('appName', '应用名称', 'auto'),
        new TextColumn('description', '应用描述', 'auto'),
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
      getData: () => {
        // 模拟数据请求REQUES
        return of({
          data: Array.from({length: this.pageLink.pageSize}, (_, index) => ({
            appName: '办公助手' + (this.pageLink.page || '') + index,
            description: '提高工作效率的办公软件。',
            createTime: '2024-06-01T12:30:00+08:00',
            status: 'active',
            actions: 'edit, delete',
          })),
          total: 50,
          page: 0,
          pageSize: 10,
        })
      },
      layouts: ['total', 'sizes', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor() {
    
  }

  ngOnInit() {

  }
}
