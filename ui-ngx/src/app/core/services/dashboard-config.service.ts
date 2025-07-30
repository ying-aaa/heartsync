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

// dashboard-config.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardConfigService {
  dashboardConfig = signal<IDashboardContext>({} as IDashboardContext);

  gridsterOption = computed(() => this.dashboardConfig().gridsterOption);

  layoutConfig = computed(() => this.dashboardConfig().layoutConfig);

  loadingStatus = signal<boolean>(false);

  dashboardDesignInstall: DashboardDesignComponent | null = null;

  constructor(
    private toastr: ToastrService,
    private dashboardService: DashboardService,
    private dashboardEditorService: DashboardEditorService,
  ) {
    effect(() => {
      const dashboardId = this.dashboardEditorService.currentDashboardId();
      dashboardId && this.loadDashboardConfig(dashboardId);
    });
  }

  setDashboardDesignInstall(dashboardDesignInstall: DashboardDesignComponent) {
    this.dashboardDesignInstall = dashboardDesignInstall; 
  }

  loadDashboardConfig(dashboardId: string) {
    this.loadingStatus.set(true);
    this.dashboardService.getDashboard(dashboardId).subscribe({
      next: (gridsterOption) => {
        this.dashboardConfig.set(gridsterOption);
        this.loadingStatus.set(false);
      },
    });
  }

  getDashboardWidgets() {
    return deepClone(this.dashboardConfig().widgets);
  }

  // 原子化配置更新方法
  updateWidgets(newWidgetChanges: Array<IDashboardWidgetContext>) {
    this.dashboardConfig.update((config) => {
      config.widgets = newWidgetChanges;
      return config;
    });
  }

  updateDashboardLayout() {}

  // 保存配置
  async saveConfig() {
    if(!this.dashboardDesignInstall) return;
    const { id } = this.dashboardConfig();
    // 获取新编辑的widget配置
    const widgets = this.dashboardDesignInstall.widgets;
    // 更新
    this.updateWidgets(widgets);
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
