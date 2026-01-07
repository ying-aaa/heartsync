import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import {
  DashboardService,
  IDashboardContext,
  IDashboardWidgetContext,
} from '@src/app/core/http/dashboard.service';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { GridsterConfig, GridsterComponent, GridsterItemComponent } from 'angular-gridster2';
import { WidgetContainerComponent } from '../widget-container/widget-container.component';

@Component({
  selector: 'hs-dashboard-runtime',
  templateUrl: './dashboard-runtime.component.html',
  styleUrls: ['./dashboard-runtime.component.less'],
  imports: [HsLoadingModule, GridsterComponent, GridsterItemComponent, WidgetContainerComponent],
})
export class DashboardRuntimeComponent implements OnInit {
  dashboardId = input<string | null>(null);

  private dashboardConfig = signal<IDashboardContext>({} as IDashboardContext);

  gridsterOption = computed<GridsterConfig>(() => ({
    rows: 1,
    columns: 1,
    ...this.dashboardConfig().gridsterOption,
  }));

  widgets = computed<Array<IDashboardWidgetContext>>(() => this.dashboardConfig().widgets || []);

  loadingStatus = signal(false);

  constructor(private dashboardService: DashboardService) {
    effect(() => {
      const dashboardId = this.dashboardId();
      if (dashboardId) {
        this.loadGridsterOption(dashboardId);
      } else {
        this.dashboardConfig.set({} as IDashboardContext);
      }
    });
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
