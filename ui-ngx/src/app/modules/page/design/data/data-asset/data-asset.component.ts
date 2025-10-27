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
  TagColumn,
  DateColumn,
  ActionColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';
import { map, lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { getParamFromRoute, isMobile } from '@src/app/core/utils';
import { AssetHttpService } from '@src/app/core/http/asset.http.service';
import { DataSourceHttpService } from '@src/app/core/http/data-source.http.service';
import { DataAssetSharedModule } from './data-source-asset.module';
import { CreateDataAssetComponent } from './create-data-asset/create-data-asset.component';

@Component({
  selector: 'hs-data-asset',
  templateUrl: './data-asset.component.html',
  imports: [
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatInputModule,
    MatButtonModule,
    HsTreeComponent,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HsDynamicTableModule,
    MatButtonToggleModule,
    DataAssetSharedModule,
  ],
})
export class DataAssetComponent implements OnInit {
  @ViewChild('HsTreeRef') hsTreeRef: HsTreeComponent;
  appId: string = getParamFromRoute('appId', this.route)!;
  businessKey = 'asset';

  appName = new FormControl('');

  displayMode: 'list' | 'card' = 'list';

  directoryId = '';

  pageLink = new PageLink(
    0,
    20,
    [{ prop: 'directoryId' }, { prop: 'name' }],
    [{ sortBy: 'name' }, { sortBy: 'description' }, { sortBy: 'createdAt', order: 'DESC' }],
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
    createNodeSuccess: (node, jsTree) => {
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
        // 名字相同会报错，请勿重复
        new TextColumn('name', '资产名称', {}, 300),
        new TextColumn('tableName', '关联表名', {}, 300),
        // new TextColumn('dataSourceId', '所属数据源', {}, 300),
        new TagColumn(
          'dataSourceId',
          '数据源',
          {
            request: this.dataSourceHttpService.findAll(new PageLink(0, 100)).pipe(
              map((res) => {
                return res.data.map((item) => ({
                  color: 'primary',
                  value: item.id,
                  label: item.name,
                }));
              }),
            ),
          },
          300,
        ),
        new TextColumn('comment', '表描述', {}, 300),
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
              },
            },
            // {
            //   name: '删除',
            //   icon: 'delete',
            //   moreName: '确认删除',
            //   action: (row, event) => {
            //     console.log('删除', row, event);
            //     this.applicationService.deleteApplication(row.id).subscribe((res) => {
            //       this.pageLink.getData();
            //       this._snackBar.open('删除应用成功!!!', '', {
            //         horizontalPosition: 'center',
            //         verticalPosition: 'top',
            //         duration: 1 * 1000,
            //       });
            //     });
            //   },
            // },
          ],
          300,
          'center',
        ),
      ],
      getData: () => {
        // 模拟数据请求REQUES
        return this.assetHttpService.findAll(this.pageLink);
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private applicationService: ApplicationService,
    private assetHttpService: AssetHttpService,
    private dataSourceHttpService: DataSourceHttpService,
  ) {}

  openAssetDialog(type: 'create' | 'edit', id?: string) {
    const width = isMobile() ? '100vw' : '1600px';
    const height = isMobile() ? '100vh' : '800px';
    const dialogRef = this.dialog.open(CreateDataAssetComponent, {
      data: {
        appId: this.appId,
        directoryId: this.directoryId,
        type,
        id,
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

  displayModeChange() {
    setTimeout(() => {
      this.pageLink.getData();
    }, 50);
  }

  ngOnInit() {}
}
