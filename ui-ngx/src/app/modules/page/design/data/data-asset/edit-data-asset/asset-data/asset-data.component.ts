import { Component, input, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AssetHttpService } from '@src/app/core/http/asset.http.service';
import { DataSourceHttpService } from '@src/app/core/http/data-source.http.service';
import { HsDynamicTableModule } from '@src/app/shared/components/hs-table/hs-dynamic-table.module';
import {
  IDynamicTable,
  TextColumn,
  TagColumn,
  PageLink,
  DateColumn,
  ActionColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { map } from 'rxjs';

@Component({
  selector: 'hs-asset-data',
  templateUrl: './asset-data.component.html',
  standalone: false,
  host: {
    class: 'wh-full',
  },
})
export class AssetDataComponent implements OnInit {
  assetId = input<string>('');

  pageLink = new PageLink(
    0,
    20,
    [{ prop: 'name' }],
    [{ sortBy: 'name' }, { sortBy: 'createdAt', order: 'DESC' }],
  );

  tableColumn: TextColumn[] = [];

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      tableStyle: { padding: '0 24px' },
      pageLink: this.pageLink,
      tableColumn: this.tableColumn,
      getColumns: () => {
        return this.assetHttpService.getFields(this.assetId()).pipe(
          map((fields) => {
            return fields.map(
              (field) =>
                new TextColumn(
                  field.name,
                  `${field.name}(${field.comment || field.textType})`,
                  {},
                  200,
                ),
            ) as TextColumn[];
          }),
        );
      },

      getData: () => {
        // 模拟数据请求REQUES
        return this.assetHttpService.findAssetData(this.assetId());
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(
    private assetHttpService: AssetHttpService,
    private dataSourceHttpService: DataSourceHttpService,
  ) {}

  loadAssetFields(assetId: string) {
    // this.assetHttpService.getFields(assetId).subscribe((fields) => {
    //   this.tableColumn = fields.map(
    //     (field) =>
    //       new TextColumn(field.fieldName, field.fieldName, {
    //         click: (row) => {
    //           console.log('%c Line:121 🍻 row', 'color:#42b983', row);
    //         },
    //       }),
    //   ) as TextColumn[];
    // });
  }

  ngOnInit() {
    this.loadAssetFields(this.assetId());
  }
}
