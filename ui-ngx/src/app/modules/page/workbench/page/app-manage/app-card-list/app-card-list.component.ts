import { DatePipe } from '@angular/common';
import { Component, computed, input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ColumnType, IDynamicTable } from '@src/app/shared/components/hs-table/table.model';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { HsSvgModule } from '@shared/components/hs-svg/hs-svg.module';

@Component({
  selector: 'hs-app-card-list',
  templateUrl: './app-card-list.component.html',
  styleUrl: './app-card-list.component.less',
  imports: [
    DatePipe,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    HsLoadingModule,
    MatDividerModule,
    HsSvgModule,
  ],
})
export class AppCardListComponent implements OnInit, OnDestroy {
  tableConfig = input.required<IDynamicTable>();

  pageLink = computed(() => this.tableConfig().pageLink);

  tableColumn = computed(() => this.tableConfig().tableColumn);

  actionColumn = computed(() => this.tableColumn().at(-1).config);

  displayedColumns = computed(() => this.tableConfig().displayedColumns);

  tableStyle = computed(() => this.tableConfig().tableStyle);

  dataSource = signal<any[]>([]);

  ColumnType = ColumnType;

  loadingStatus = false;

  request$ = new Subject<void>();

  private destroy$ = new Subject<void>();
  private dataSubscription?: Subscription;

  constructor() {}

  onPageChange(event: any) {
    const { pageIndex, pageSize } = event;
    if (pageSize !== this.pageLink().pageSize) {
      this.pageLink().changePageSize(pageSize);
    } else {
      this.pageLink().changePage(pageIndex);
    }
  }

  // 获取表格数据
  async getTableData() {
    this.request$.next();
  }

  handleTableData() {
    const { getData } = this.tableConfig();
    this.dataSubscription = this.request$
      .pipe(
        switchMap(() => {
          this.loadingStatus = true;
          this.dataSource.set([]);
          return getData().pipe(
            // 确保组件销毁时自动取消
            takeUntil(this.destroy$),
          );
        }),
      )
      .subscribe({
        next: ({ data, total }) => {
          this.dataSource.set(data);
          total = total || data.length;
          this.pageLink().updateTotal(total);
          this.loadingStatus = false;
        },
        error: () => {
          this.loadingStatus = false;
        },
      });
  }

  ngOnInit() {
    this.handleTableData();

    this.pageLink().setGetData(this.getTableData.bind(this));

    if (this.tableConfig().initExec) {
      this.pageLink().getData();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.dataSubscription?.unsubscribe();
  }
}
