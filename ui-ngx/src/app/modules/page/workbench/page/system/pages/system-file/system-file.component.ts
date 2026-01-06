import { Component, effect, input, OnInit, signal, viewChild } from '@angular/core';
import { FileGroupListComponent } from './file-group-list/file-group-list.component';
import {
  PageLink,
  IDynamicTable,
  TextColumn,
  DateColumn,
  ActionColumn,
  CustomColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { map } from 'rxjs';
import { HsDynamicTableModule } from '@src/app/shared/components/hs-table/hs-dynamic-table.module';
import { UploadFileService } from '@src/app/core/http/upload-file.service';
import { FileSizePipe } from '@src/app/shared/pipes/file-size.pipe';
import { getFileUrl } from '@src/app/core/utils';

@Component({
  selector: 'hs-system-file',
  templateUrl: './system-file.component.html',
  imports: [FileGroupListComponent, HsDynamicTableModule],
  providers: [FileSizePipe],
})
export class SystemFileComponent implements OnInit {
  fileGroup = viewChild<FileGroupListComponent>('FileGroup');

  groupId = signal<string>('');

  pageLink = new PageLink(0, 10, [{ prop: 'search' }], []);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      tableStyle: {},
      trRowStyle: { backgroundColor: 'var(--primary-bg-color)' },
      pageLink: this.pageLink,
      tableColumn: [
        new CustomColumn('preview', '预览', {}, 100),
        new TextColumn('original_name', '文件名', {}, 240),
        new TextColumn('mime_type', '类型', {}, 100),
        new TextColumn('size', '大小', {}, 120),
        new TextColumn('dimensions', '尺寸', {}, 100),
        new DateColumn('created_at', '创建时间', {}, 200),
        new TextColumn('url', '文件地址', {}, 600),
        new ActionColumn('actions', '', [
          {
            name: '预览',
            icon: 'delete',
            action: (row) => {
              window.open(row.url);
            },
          },
        ]),
      ],
      getData: () => {
        return this.uploadFileService.getResourcesByCategory(this.groupId()!, this.pageLink).pipe(
          map((item) => ({
            ...item,
            data: item.data.map((item: any) => ({
              ...item,
              preview: getFileUrl(item.url),
              size: this.fileSizePipe.transform(item.size),
              dimensions: `${item.width}*${item.height}`,
            })),
          })),
        );
      },
      layouts: ['sizes', 'paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(
    private uploadFileService: UploadFileService,
    private fileSizePipe: FileSizePipe,
  ) {
    effect(() => {
      const groupId = this.fileGroup()!.seletedGroupId();
      if (groupId !== null) {
        this.groupId.set(groupId);
        this.pageLink.getData();
      }
    });
  }

  ngOnInit() {}
}
