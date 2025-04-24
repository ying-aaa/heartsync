import { Component, computed, Injector, input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ColumnType, DataType, IDynamicTable, TableColumn } from './table.model';
import { SelectionModel } from '@angular/cdk/collections';
import { error } from 'console';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

export interface PeriodicElement {
  appName: string;
  description: string;
  createTime: string;
  status: string;
  actions: string;
}

@Component({
  selector: 'hs-dynamic-table',
  templateUrl: './hs-dynamic-table.component.html',
  styleUrls: ['./hs-dynamic-table.component.less'],
  standalone: false
})
export class HsDynamicTableComponent implements OnInit {
  tableConfig = input.required<IDynamicTable>();

  pageLink = computed(() => this.tableConfig().pageLink);

  tableColumn = computed(() => this.tableConfig().tableColumn);

  displayedColumns = computed(() => this.tableConfig().displayedColumns);

  dataSource = new MatTableDataSource<any[]>([]);

  ColumnType = ColumnType;

  constructor(private paginatorIntl: MatPaginatorIntl) {
    this.customizePaginatorIntl();

    this.selection.changed.subscribe((event) => {
      this.pageLink().setMultipleSelection(this.selection.selected);
    })
  }

  customizePaginatorIntl() {
    // 自定义分页器的文本
    this.paginatorIntl.itemsPerPageLabel = '每页显示';
    this.paginatorIntl.nextPageLabel = '下一页';
    this.paginatorIntl.previousPageLabel = '上一页';
    this.paginatorIntl.firstPageLabel = '第一页';
    this.paginatorIntl.lastPageLabel = '最后一页';
    this.paginatorIntl.getRangeLabel = this.getCustomRangeLabel;
  }

  getCustomRangeLabel = (page: number, pageSize: number, length: number) => {
    if (!this.tableConfig().matchLayout('total')) return '';
    if (length === 0 || pageSize === 0) {
      return `第0项，共0项`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `第${startIndex + 1} - ${endIndex}项，共${length}项`;
  };

  onPageChange(event: any) {
    const { pageIndex, pageSize } = event;
    if (pageSize !== this.pageLink().pageSize) {
      this.pageLink().changePageSize(pageSize);
    }else{
      this.pageLink().changePage(pageIndex);
    }
  }


  // 获取表格数据
  async getTableData() {
    try {
      const { getData } = this.tableConfig();
      getData().subscribe({
        next: ({data, total, page, pageSize}: DataType) => {
          this.dataSource.data = data;
          this.pageLink().updateTotal(total);
        },
        error: () => {

        }
      })
    } catch (error) {
      
    }
  }

  // 选择
  selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.appName + 1}`;
  }

  ngOnInit() {
    this.pageLink().setGetData(this.getTableData.bind(this));
    this.pageLink().getData();
  }
}
