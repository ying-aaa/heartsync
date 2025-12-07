import { Component, OnDestroy, OnInit } from '@angular/core';
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
  dashboardId: string | null;
  menuId: string;
  private routeSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private runAppMenuService: RunAppMenuService,
  ) {
    this.routeSub = this.route.params.subscribe((params) => {
      const dashboardId = params['dashboardId'];
      const menuId = params['menuId'];

      if (menuId !== this.menuId) {
        this.menuId = menuId;
        const menuData = this.runAppMenuService.findNode(menuId);
        const dashboardId = menuData?.dashboardId || null;
        this.setDashBoardId(dashboardId);
        return;
      }

      this.setDashBoardId(dashboardId);
    });
  }

  setDashBoardId(dashboardId: string | null): void {
    if (dashboardId !== this.dashboardId) {
      this.dashboardId = dashboardId;
      this.updateComponent(dashboardId);
    }
  }

  updateComponent(dashboardId: string | null): void {
    console.log('路由参数更新，执行更新逻辑，当前 ID:', dashboardId);
  }

  ngOnInit() {}

  // 组件注销
  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
}
