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
import { map, tap } from 'rxjs';

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

  fileName = new FormControl('');

  pageLink = new PageLink(0, 5, 'createdAt', 'DESC');

  TextColumn = TextColumn;

  treeConfig = signal<IFileTreeConfig>({
    featureList: ['createFolder', 'rename', 'remove', 'blank'],
  });

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('name', '应用名称'),
        new TextColumn('description', '应用描述'),
        new DateColumn('createdAt', '创建时间', {
          dateFormat: 'YYYY-MM-DD HH:mm:ss',
        }),
        new ImgColumn('imageUrl', '应用图标'),
        new TagColumn('status', '状态', {
          tagMap: [
            { label: '激活', value: 'active', color: 'green' },
            { label: '关闭', value: 'close', color: 'red' },
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
        return this.applicationService.findAllApplications(this.pageLink);
      },
      layouts: ['total', 'sizes', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private applicationService: ApplicationService,
  ) {}

  createRecord() {
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : '600px';
    const dialogRef = this.dialog.open(CreateAppComponent, {
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
