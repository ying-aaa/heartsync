import { Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';
import { isMobile } from '@src/app/core/utils';
import { MatDialog } from '@angular/material/dialog';
import { CreateAppComponent } from './create-app/create-app.component';
import { ApplicationService } from '@src/app/core/http/application.service';
import { delay, lastValueFrom, map, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @ViewChild('HsTreeRef') hsTreeRef: HsTreeComponent;

  appName = new FormControl('');

  directoryId = '';

  pageLink = new PageLink(
    0,
    20,
    [{ prop: 'directoryId' }, { prop: 'name' }],
    [
      { sortBy: 'name' },
      { sortBy: 'description' },
      { sortBy: 'createdAt', order: 'DESC' },
    ],
  );

  treeConfig = signal<IFileTreeConfig>({
    featureList: ['createFolder', 'rename', 'remove', 'blank', 'search'],
    deleteEvent: async (node, jsTree) => {
      const hasData$ = this.applicationService
        .checkDataExists(node.id)
        .pipe(map((res) => res.hasData));
      let value;
      try {
        value = await lastValueFrom(hasData$);
        if (value) {
          this._snackBar.open('该目录下有应用，无法删除!', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1 * 1000,
          });
        }
      } catch (error) {}
      return !value;
    },
    selectEvent: (node, jsTree) => {
      if (node) {
        this.directoryId = node.id;
        this.pageLink.changeSearch('directoryId', this.directoryId);
        this.pageLink.getData();
      }
    },
  });

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: false,
      tableStyle: { padding: '0 24px' },
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('name', '应用名称', {}, 300),
        new TextColumn('description', '应用描述', {}, 300),
        new ImgColumn(
          'imageUrl',
          '应用图标',
          {
            defaultValue: '/assets/workbench/app.png',
          },
          300,
        ),
        new TagColumn(
          'status',
          '状态',
          {
            tagMap: [
              { label: '激活', value: 'active', color: 'green' },
              { label: '关闭', value: 'close', color: 'red' },
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
              name: '去开发',
              icon: 'edit',
              action: (row, event) => {
                event.stopPropagation();
                this.router.navigate(['/design'], {
                  queryParams: { appId: row.id },
                });
              },
            },
            {
              name: '删除',
              icon: 'delete',
              action: (row, event) => {
                console.log('删除', row, event);
                this.applicationService
                  .deleteApplication(row.id)
                  .subscribe((res) => {
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
        return this.applicationService
          .findAllApplications(this.pageLink)
          .pipe(delay(0));
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private applicationService: ApplicationService,
  ) {}

  createRecord() {
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : '600px';
    const dialogRef = this.dialog.open(CreateAppComponent, {
      data: {
        directoryId: this.directoryId,
      },
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.pageLink.getData();
    });
  }

  ngOnInit() {}
}
