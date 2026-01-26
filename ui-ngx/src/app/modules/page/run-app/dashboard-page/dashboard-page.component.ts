import { Component, computed, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardRuntimeComponent } from '@src/app/modules/components/dashboard-runtime/dashboard-runtime.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';

@Component({
  selector: 'hs-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.less'],
  imports: [RouterModule, DashboardRuntimeComponent, HsSvgModule],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private routeSub: Subscription | null = null;

  dashboardId = computed(() => this.runAppMenuService.selectedDashboardId());

  constructor(private runAppMenuService: RunAppMenuService) {}

  ngOnInit() {}

  // 组件注销
  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
}
