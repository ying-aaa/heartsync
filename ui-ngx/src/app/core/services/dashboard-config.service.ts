import { computed, effect, Injectable, signal } from '@angular/core';
import { DashboardService } from '../http/dashboard.service';
import { DashboardEditorService } from './dashboard-editor.service';
import { deepClone } from '../utils';
import { ToastrService } from 'ngx-toastr';
import { GridsterConfig } from 'angular-gridster2';
import {
  IDashboardConfig,
  IDashboardWidgetConfig,
  IWidgetContext,
  IWidgetTypesConfig,
} from '@heartsync/types';

// dashboard-config.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardConfigService {
  private dashboardConfig = signal<IDashboardConfig>({} as IDashboardConfig);

  public widgets = signal<IWidgetContext>({} as IWidgetContext);

  public gridsterWidgets = signal<Array<IDashboardWidgetConfig>>([]);

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
    const { widgets, gridsterConfig } = dashboardConfig;
    const { gridsterOption, gridsterWidgets } = gridsterConfig || {};
    this.widgets.set(deepClone(widgets || ({} as IWidgetContext)));
    this.gridsterWidgets.set(deepClone(gridsterWidgets || []));
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
    const newWidgets = this.gridsterWidgets();
    this.dashboardConfig.update((config) => {
      config.gridsterConfig.gridsterWidgets = newWidgets;
      return config;
    });
  }

  // 更新仪表板布局配置
  updateDashboardGridsterOption() {
    const newGridsterOption = this.gridsterOption();
    this.dashboardConfig.update((config) => {
      config.gridsterConfig.gridsterOption = newGridsterOption;
      return config;
    });
  }

  // 新增部件
  addWidget(widget: IDashboardWidgetConfig) {
    this.gridsterWidgets.update((gridsterWidgets) => {
      gridsterWidgets.push(widget);
      return gridsterWidgets;
    });
  }

  // 删除部件
  removeWidget(widget: IDashboardWidgetConfig) {
    this.gridsterWidgets.update((gridsterWidgets) => {
      gridsterWidgets = gridsterWidgets.filter((w) => w.id !== widget.id);
      return gridsterWidgets;
    });
  }

  // 更新布局配置
  updateGridsterOption(gridsterOption: GridsterConfig) {
    this.gridsterOption.set(gridsterOption);
  }

  // 保存配置
  async saveConfig() {
    const { id } = this.dashboardConfig();
    this.loadingStatus.set(true);

    // 更新仪表板配置
    this.updateDashboardWidgets();
    this.updateDashboardGridsterOption();

    // 调用接口保存
    this.dashboardService.updateDashboard(id!, this.dashboardConfig()).subscribe({
      next: (dashboardConfig) => {
        this.dashboardConfig.set(dashboardConfig);
        this.loadingStatus.set(false);
        this.toastr.success('仪表板配置已保存', '', {
          positionClass: 'toast-top-center',
        });
      },
    });
  }
}
