import { Component, computed, effect, input, OnInit, signal, ViewChild } from '@angular/core';
import {
  DashboardService,
  IDashboardContext,
  IDashboardWidgetContext,
} from '@src/app/core/http/dashboard.service';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import {
  GridsterConfig,
  GridsterComponent,
  GridsterItemComponent,
  GridType,
} from 'angular-gridster2';
import { WidgetContainerComponent } from '../widget-container/widget-container.component';
import { SystemService } from '@src/app/core/services/system.service';
import { IDashboardConfig } from '@heartsync/types';

@Component({
  selector: 'hs-dashboard-runtime',
  templateUrl: './dashboard-runtime.component.html',
  styleUrls: ['./dashboard-runtime.component.less'],
  imports: [HsLoadingModule, GridsterComponent, GridsterItemComponent, WidgetContainerComponent],
})
export class DashboardRuntimeComponent implements OnInit {
  @ViewChild(GridsterComponent, {
    static: true,
  })
  gridster: GridsterComponent;

  dashboardId = input<string | null>(null);

  private dashboardConfig = signal<IDashboardConfig>({} as IDashboardConfig);

  gridsterOption = computed<GridsterConfig>(() => {
    const gridsterOption = this.dashboardConfig().gridsterConfig.gridsterOption || {};
    if (this.isMobile() && gridsterOption?.gridType === GridType.Fit) {
      gridsterOption.gridType = GridType.Fixed;
    }
    const fixedRowHeight = this.detectRowSize(gridsterOption) || 70;

    const options: GridsterConfig = {
      // rows: 1,
      // columns: 1,
      ...gridsterOption,
      keepFixedHeightInMobile: this.isMobile(),
      useTransformPositioning: true, // 开启硬件加速
      // 除了 fixed
      rowHeight: '70px',
      // fixed
      fixedRowHeight,
      compactType: 'none',
      disableWindowResize: false,
      allowMultiLayer: true,
      defaultLayerIndex: 2,
      baseLayerIndex: 2,
      maxLayerIndex: 2,
    };
    return options;
  });

  gridsterWidgets = computed<Array<IDashboardWidgetContext>>(
    () => this.dashboardConfig().gridsterConfig.gridsterWidgets || [],
  );

  isMobile = computed(() => this.systenService.isMobile());

  loadingStatus = signal(false);

  constructor(
    private dashboardService: DashboardService,
    private systenService: SystemService,
  ) {
    effect(() => {
      const dashboardId = this.dashboardId();
      if (dashboardId) {
        this.loadGridsterOption(dashboardId);
      } else {
        this.dashboardConfig.set({} as IDashboardConfig);
      }
    });
  }

  private detectRowSize(gridsterOpts: GridsterConfig): number | null {
    const isMobile = this.isMobile();
    const gridsterHeight = this.gridster?.el.offsetHeight;
    let rowHeight = null;
    if (gridsterHeight) {
      let totalRows = 0;
      for (const widget of this.gridsterWidgets()) {
        totalRows += widget.rows;
      }
      // 核心公式：行高 = (容器高度 - 间距总占用) / 总行数
      rowHeight =
        (gridsterHeight -
          (gridsterOpts.margin || 10) * (totalRows + (gridsterOpts.outerMargin ? 1 : -1))) /
        totalRows;
    }
    return rowHeight;
  }

  loadGridsterOption(dashboardId: string) {
    this.loadingStatus.set(true);
    this.dashboardService.getDashboard(dashboardId).subscribe({
      next: (dashboardConfig) => {
        this.dashboardConfig.set(dashboardConfig);
        this.loadingStatus.set(false);
      },
    });
  }

  ngOnInit() {}
}
