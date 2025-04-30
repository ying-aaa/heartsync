import { Component, computed, Injector, input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  ColumnType,
  IDynamicTable,
} from './table.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject, Subscription, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'hs-dynamic-table',
  templateUrl: './hs-dynamic-table.component.html',
  styleUrls: ['./hs-dynamic-table.component.less'],
  standalone: false,
})
export class HsDynamicTableComponent implements OnInit, OnDestroy {
  tableConfig = input.required<IDynamicTable>();

  pageLink = computed(() => this.tableConfig().pageLink);

  tableColumn = computed(() => this.tableConfig().tableColumn);

  displayedColumns = computed(() => this.tableConfig().displayedColumns);

  tableStyle = computed(() => this.tableConfig().tableStyle);

  dataSource = new MatTableDataSource<any[]>([]);

  ColumnType = ColumnType;

  loadingStatus = false;

  constructor(private paginatorIntl: MatPaginatorIntl) {
    this.customizePaginatorIntl();

    this.selection.changed.subscribe((event) => {
      this.pageLink().setMultipleSelection(this.selection.selected);
    });
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
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `第${startIndex + 1} - ${endIndex}项，共${length}项`;
  };

  onPageChange(event: any) {
    const { pageIndex, pageSize } = event;
    if (pageSize !== this.pageLink().pageSize) {
      this.pageLink().changePageSize(pageSize);
    } else {
      this.pageLink().changePage(pageIndex);
    }
  }

  private destroy$ = new Subject<void>();
  private dataSubscription?: Subscription;

  request$ = new Subject<void>();
  
  // 获取表格数据
  async getTableData() {
    this.request$.next();
  }

  handleTableData() {
    const { getData } = this.tableConfig();
    
    this.dataSubscription = this.request$.pipe(
      switchMap(() => {
        this.loadingStatus = true;
        return getData().pipe(
          // 确保组件销毁时自动取消
          takeUntil(this.destroy$) 
        );
      })
    ).subscribe({
      next: ({ data, total }) => {
        this.dataSource.data = data;
        this.pageLink().updateTotal(total);
        this.loadingStatus = false;
      },
      error: () => {
        this.loadingStatus = false;
      }
    });
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

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.appName + 1}`;
  }

  ngOnInit() {
    this.handleTableData();

    this.pageLink().setGetData(this.getTableData.bind(this));

    console.log("%c Line:138 🥃", "color:#4fff4B", this.tableConfig().initExec);
    if(this.tableConfig().initExec) {
      this.pageLink().getData();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.dataSubscription?.unsubscribe();
  }
}
