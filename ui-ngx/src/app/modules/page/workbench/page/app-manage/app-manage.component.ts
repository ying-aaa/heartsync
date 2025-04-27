import { Component, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ActionColumn,
  DateColumn,
  IDynamicTable,
  ImgColumn,
  PageLink,
  TagColumn,
  TextColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { HsDynamicTableModule } from '@src/app/shared/components/hs-table/hs-dynamic-table.module';
import { map, of } from 'rxjs';
import { Router } from '@angular/router';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';

@Component({
  selector: 'hs-app-manage',
  templateUrl: './app-manage.component.html',
  imports: [
    MatDividerModule,
    HsTreeComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    HsDynamicTableModule,
  ],
})
export class AppManageComponent implements OnInit {
  treeConfig = signal({});
  fileName = new FormControl('');

  pageLink = new PageLink(0, 30);

  TextColumn = TextColumn;

  test = eval('this.TextColumn');

  tableConfig = signal(
    new IDynamicTable({
      pageLink: this.pageLink,
      tableColumn: [
        // new TextColumn('appName', '应用名称'),
        Reflect.construct(this.test, ['appName', '应用名称']),

        Reflect.construct(this.test, ['description', '应用描述']),
        // new TextColumn('description', '应用描述'),
        new DateColumn('createTime', '应用描述', {
          dateFormat: 'YYYY-MM-DD',
        }),
        new ImgColumn('url', '应用图标'),
        new TagColumn('status', '状态', {
          // request: of([
          //     { a: '1111', b: 1, c: 'green' },
          //     { a: '失败', b: 'error', c: 'red' },
          // ]).pipe(
          //   map((res) =>
          //     res.map((item) => ({ label: item.a, value: item.b, color: item.c })
          // ))),
          tagMap: [
            { label: '成功', value: 1, color: 'green' },
            { label: '失败', value: 'error', color: 'red' },
          ],
        }),
        new ActionColumn('actions', '操作', [
          {
            name: '编辑',
            icon: 'edit',
            action: (row, event) => {
              event.stopPropagation();
              this.router.navigate(['/design'], {
                queryParams: { appId: row.appName },
              });
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
          data: Array.from({ length: this.pageLink.pageSize }, (_, index) => ({
            appName: '办公助手' + (this.pageLink.page || '') + index,
            description: '提高工作效率的办公软件。',
            createTime: '2024-06-01T12:30:00+08:00',
            url: '/heartsync-files/self-record/2231745493689_.pic.jpg',
            status: 'error',
            actions: 'edit, delete',
          })),
          total: 50,
          page: 0,
          pageSize: 10,
        });
      },
      layouts: ['total', 'sizes', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(private router: Router) {}

  ngOnInit() {}
}
