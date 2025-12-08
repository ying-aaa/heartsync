import { Component, computed, effect, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardRuntimeComponent } from '@src/app/modules/components/dashboard-runtime/dashboard-runtime.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';

@Component({
  selector: 'hs-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.less'],
  imports: [RouterModule, DashboardRuntimeComponent],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private routeSub: Subscription | null = null;

  dashboardId = computed(() => this.runAppMenuService.selectedDashboardId());

  constructor(
    private route: ActivatedRoute,
    private runAppMenuService: RunAppMenuService,
  ) {}

  ngOnInit() {}

  // 组件注销
  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
}
