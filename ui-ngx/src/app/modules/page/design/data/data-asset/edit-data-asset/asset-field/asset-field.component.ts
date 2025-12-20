import { Component, input, OnInit, signal } from '@angular/core';
import { AssetHttpService } from '@src/app/core/http/asset.http.service';
import { DataSourceHttpService } from '@src/app/core/http/data-source.http.service';
import {
  PageLink,
  TextColumn,
  IDynamicTable,
  TableColumn,
  DateColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'hs-asset-field',
  templateUrl: './asset-field.component.html',
  standalone: false,
  host: {
    class: 'wh-full',
  },
})
export class AssetFieldComponent implements OnInit {
  assetId = input<string>('');

  pageLink = new PageLink(
    0,
    20,
    [{ prop: 'name' }],
    [{ sortBy: 'name' }, { sortBy: 'createdAt', order: 'DESC' }],
  );

  tableColumn: TableColumn[] = [
    new TextColumn('name', '字段名称', {}, 300),
    new TextColumn('textType', '字段类型', {}, 300),
    new TextColumn('length', '长度', {}, 300),
    new TextColumn('comment', '注释', {}, 300),
    new TextColumn('isPrimaryKey', '是否主键', {}, 300),
    new TextColumn('notNull', 'Not Null', {}, 300),
    new DateColumn('createAt', '创建时间', {}, 300),
  ];

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      tableStyle: { padding: '0 24px' },
      pageLink: this.pageLink,
      tableColumn: this.tableColumn,
      getData: (): Observable<any> => {
        return this.assetHttpService.getFields(this.assetId());
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(private assetHttpService: AssetHttpService) {}

  ngOnInit() {}
}
