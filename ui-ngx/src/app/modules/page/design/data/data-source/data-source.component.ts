import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationService } from '@src/app/core/http/application.service';
import { HsDynamicTableModule } from '@src/app/shared/components/hs-table/hs-dynamic-table.module';
import {
  PageLink,
  IDynamicTable,
  TextColumn,
  ImgColumn,
  TagColumn,
  DateColumn,
  ActionColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { delay } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { getParamFromRoute, isMobile } from '@src/app/core/utils';
import { DataSourceHttpService } from '@src/app/core/http/data-source.http.service';
import { SourceCardListComponent } from './source-card-list/source-card-list.component';
import { CreateDataSourceComponent } from './create-data-source/create-data-source.component';
import { DataSourceSharedModule } from './data-source-shared.module';

@Component({
  selector: 'hs-data-source',
  templateUrl: './data-source.component.html',
  imports: [
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HsDynamicTableModule,
    MatButtonToggleModule,
    SourceCardListComponent,
    DataSourceSharedModule,
  ],
})
export class DataSourceComponent implements OnInit {
  @ViewChild('HsTreeRef') hsTreeRef: HsTreeComponent;

  appId: string = getParamFromRoute('appId', this.route)!;

  appName = new FormControl('');

  displayMode: 'list' | 'card' = 'card';

  directoryId = '';

  pageLink = new PageLink(
    0,
    20,
    [{ prop: 'name' }],
    [{ sortBy: 'name' }, { sortBy: 'description' }, { sortBy: 'createdAt', order: 'DESC' }],
  );

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      tableStyle: { padding: '0 24px' },
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('name', '数据源名称', {}, 300),
        new TextColumn('type', '数据源类型', {}, 300),
        new TextColumn('host', '主机地址', {}, 300),
        new TextColumn('username', '用户名', {}, 300),

        new TagColumn(
          'status',
          '连接状态',
          {
            tagMap: [
              { label: '在线', value: 'online', color: 'green' },
              { label: '离线', value: 'offline', color: 'red' },
            ],
          },
          300,
        ),
        new DateColumn(
          'createdAt',
          '创建时间',
          {
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
          },
          300,
        ),
        new ActionColumn(
          'actions',
          '操作',
          [
            {
              name: '编辑',
              icon: 'border_color',
              action: (row, event) => {
                event.stopPropagation();
                this.openDataSourceDialog('edit', row.id);
              },
            },
            {
              name: '删除',
              icon: 'delete',
              moreName: '确认删除',
              action: (row, event) => {
                console.log('删除', row, event);
                this.dataSourceHttpService.remove(row.id).subscribe((res) => {
                  this.pageLink.getData();
                  this._snackBar.open('删除应用成功!!!', '', {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 1 * 1000,
                  });
                });
              },
            },
          ],
          300,
          'center',
        ),
      ],
      getData: () => {
        // 模拟数据请求REQUES
        return this.dataSourceHttpService.findAll(this.pageLink);
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dataSourceHttpService: DataSourceHttpService,
  ) {
    this.pageLink.changeSearch('appId', this.appId);
  }

  // 处理编辑和创建

  openDataSourceDialog(type: 'create' | 'edit', id?: string) {
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : '600px';
    const dialogRef = this.dialog.open(CreateDataSourceComponent, {
      data: {
        appId: this.appId,
        type,
        id,
      },
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.componentInstance?.resetForm();
      if (result) this.pageLink.getData();
    });
  }

  displayModeChange() {
    setTimeout(() => {
      this.pageLink.getData();
    }, 50);
  }

  ngOnInit() {}
}
