import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, signal } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  DashboardService,
  IDashboardContext,
  IDashboardWidgetContext,
} from '../http/dashboard.service';
import { DashboardEditorService } from './dashboard-editor.service';
import { deepClone } from '../utils';
import { toObservable } from '@angular/core/rxjs-interop';

// dashboard-config.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardConfigService {
  dashboardConfig = signal<IDashboardContext>({} as IDashboardContext);

  widgets = computed(() => this.dashboardConfig().widgets);

  gridsterOption = computed(() => this.dashboardConfig().gridsterOption);

  layoutConfig = computed(() => this.dashboardConfig().layoutConfig);

  loadingStatus = signal<boolean>(false);

  constructor(
    private dashboardService: DashboardService,
    private dashboardEditorService: DashboardEditorService,
  ) {
    effect(() => {
      const dashboardId = this.dashboardEditorService.currentDashboardId();
      dashboardId && this.loadDashboardConfig(dashboardId);
    });
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
    const { id } = this.dashboardConfig();
    this.dashboardService
      .updateDashboard(id!, this.dashboardConfig())
      .subscribe({
        next: () => {},
      });
  }
}
