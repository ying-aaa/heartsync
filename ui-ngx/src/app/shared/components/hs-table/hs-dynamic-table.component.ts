import {
  Component,
  computed,
  effect,
  inject,
  input,
  DestroyRef,
  OnInit,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, switchMap, tap, finalize, catchError, of } from 'rxjs';
import { ColumnType, IDynamicTable, ISortType } from './table.model';

@Component({
  selector: 'hs-dynamic-table',
  templateUrl: './hs-dynamic-table.component.html',
  styleUrls: ['./hs-dynamic-table.component.less'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HsDynamicTableComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly paginatorIntl = inject(MatPaginatorIntl);

  sort = viewChild<MatSort>(MatSort);

  tableConfig = input.required<IDynamicTable>();

  pageLink = computed(() => this.tableConfig().pageLink);
  tableStyle = computed(() => this.tableConfig().tableStyle);

  private loadedColumns = signal<any[] | null>(null);

  tableColumn = computed(() => {
    const dynamic = this.loadedColumns();
    return dynamic !== null ? dynamic : this.tableConfig().tableColumn || [];
  });

  displayedColumns = computed(() => {
    const columns = this.tableColumn();
    return this.tableConfig().displayedColumns;
  });

  dataSource = new MatTableDataSource<any[]>([]);
  selection = new SelectionModel<any>(true, []);
  ColumnType = ColumnType;

  loadingStatus = signal(false);

  private loadTableData$ = new Subject<void>();
  private loadColumnData$ = new Subject<void>();

  constructor() {
    effect(() => {
      const sortComponent = this.sort();
      if (sortComponent) {
        this.setDefaultSort(sortComponent);
      }
    });

    this.selection.changed.pipe(takeUntilDestroyed()).subscribe(() => {
      this.pageLink().setMultipleSelection(this.selection.selected);
    });
  }

  ngOnInit() {
    this.customizePaginatorIntl();

    this.setupDataStreams();

    this.loadColumnData$.next();

    this.pageLink().setGetData(this.getTableData.bind(this));
  }

  private setupDataStreams() {
    this.loadColumnData$
      .pipe(
        tap(() => this.loadingStatus.set(true)),
        switchMap(() => {
          const getColumnsFn = this.tableConfig().getColumns;
          if (!getColumnsFn) return of(null);
          return getColumnsFn();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        if (res) {
          this.tableConfig().setColumns?.(res);
          this.loadedColumns.set(res);
        }
        if (this.tableConfig().initExec) {
          this.loadTableData$.next();
        } else {
          this.loadingStatus.set(false);
        }
      });

    this.loadTableData$
      .pipe(
        tap(() => this.loadingStatus.set(true)),
        switchMap(() => {
          const { getData } = this.tableConfig();
          return getData().pipe(
            catchError((err) => {
              console.error('表数据加载失败', err);
              return of([]);
            }),
            finalize(() => this.loadingStatus.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res: any) => {
        if (Array.isArray(res)) {
          this.dataSource.data = res;
          this.pageLink().updateTotal(res.length);
        } else if (res) {
          const data = res.data || [];
          const total = res.total ?? data.length;
          this.dataSource.data = data;
          this.pageLink().updateTotal(total);
        } else {
          this.dataSource.data = [];
          this.pageLink().updateTotal(0);
        }
      });
  }

  getTableData() {
    this.loadTableData$.next();
  }

  setDefaultSort(sort: MatSort) {
    const { sortBy, order } = this.pageLink().sortData;
    if (sortBy && order) {
      sort.active = sortBy;
      sort.direction = order.toLowerCase() as SortDirection;
    }
  }

  onSortChange(event: Sort): void {
    const { active, direction } = event;
    // 转换为大写以匹配 ISortType (ASC/DESC)
    this.pageLink().changeSort(active, direction.toUpperCase() as ISortType);
  }

  onPageChange(event: any) {
    const { pageIndex, pageSize } = event;
    const currentLink = this.pageLink();

    if (pageSize !== currentLink.pageSize) {
      currentLink.changePageSize(pageSize);
    } else {
      currentLink.changePage(pageIndex);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows && numRows > 0;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.appName + 1}`;
  }

  private customizePaginatorIntl() {
    this.paginatorIntl.itemsPerPageLabel = '每页显示';
    this.paginatorIntl.nextPageLabel = '下一页';
    this.paginatorIntl.previousPageLabel = '上一页';
    this.paginatorIntl.firstPageLabel = '第一页';
    this.paginatorIntl.lastPageLabel = '最后一页';

    this.paginatorIntl.getRangeLabel = (page, pageSize, length) => {
      if (!this.tableConfig().matchLayout('total')) return '';
      if (length === 0 || pageSize === 0) {
        return `第0项，共0项`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `第${startIndex + 1} - ${endIndex}项，共${length}项`;
    };
  }
}
