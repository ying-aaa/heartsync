import { computed, effect, Injectable, signal } from '@angular/core';
import {
  DashboardService,
  IDashboardContext,
  IDashboardWidgetContext,
} from '../http/dashboard.service';
import { DashboardEditorService } from './dashboard-editor.service';
import { deepClone } from '../utils';
import { ToastrService } from 'ngx-toastr';
import { DashboardDesignComponent } from '@src/app/modules/page/design/dashboard/dashboard-design.component';
import { GridsterConfig } from 'angular-gridster2';

// dashboard-config.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardConfigService {
  private dashboardConfig = signal<IDashboardContext>({} as IDashboardContext);

  public widgets = signal<Array<IDashboardWidgetContext>>([]);

  public gridsterOption = signal<GridsterConfig>({});

  loadingStatus = signal<boolean>(false);

  constructor(
    private toastr: ToastrService,
    private dashboardService: DashboardService,
    private dashboardEditorService: DashboardEditorService,
  ) {
    effect(() => {
      const dashboardId = this.dashboardEditorService.currentDashboardId();
      dashboardId && this.loadDashboardConfig(dashboardId);
    });

    effect(() => {
      // 依据 this.dashboardConfig()
      this.useOriginConfig();
    });
  }

  // 使用仪表板原始配置
  useOriginConfig() {
    const dashboardConfig = this.dashboardConfig();
    const { widgets, gridsterOption } = dashboardConfig;
    this.widgets.set(deepClone(widgets || []));
    console.log("%c Line:45 🍡", "color:#ea7e5c");
    this.gridsterOption.set(deepClone(gridsterOption || {}));
  }

  // 加载仪表板配置
  loadDashboardConfig(dashboardId: string) {
    this.loadingStatus.set(true);
    this.dashboardService.getDashboard(dashboardId).subscribe({
      next: (dashboardConfig) => {
        this.dashboardConfig.set(dashboardConfig);
        this.loadingStatus.set(false);
      },
    });
  }

  // 更新仪表板部件配置
  updateDashboardWidgets() {
    const newWidgets = this.widgets();
    this.dashboardConfig.update((config) => {
      config.widgets = newWidgets;
      return config;
    });
  }

  // 更新仪表板布局配置
  updateDashboardGridsterOption() {
    const newGridsterOption = this.gridsterOption();
    this.dashboardConfig.update((config) => {
      config.gridsterOption = newGridsterOption;
      return config;
    });
  }

  // 新增部件
  addWidget(widget: IDashboardWidgetContext) {
    this.widgets.update((widgets) => {
      widgets.push(widget);
      return widgets;
    });
  }

  // 删除部件
  removeWidget(widget: IDashboardWidgetContext) {
    this.widgets.update((widgets) => widgets.filter((w) => w !== widget));
  }

  // 更新布局配置
  updateGridsterOption(gridsterOption: GridsterConfig) {
    this.gridsterOption.set(gridsterOption);
  }

  // 保存配置
  async saveConfig() {
    const { id } = this.dashboardConfig();

    // 更新仪表板配置
    this.updateDashboardWidgets();
    this.updateDashboardGridsterOption();
    
    // 调用接口保存
    this.dashboardService
      .updateDashboard(id!, this.dashboardConfig())
      .subscribe({
        next: () => {
          this.toastr.success('仪表板配置已保存', '', {
            positionClass: 'toast-top-center',
          });
        },
      });
  }
}
