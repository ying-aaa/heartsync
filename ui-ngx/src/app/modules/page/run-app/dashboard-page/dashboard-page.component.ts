import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardRuntimeComponent } from '@src/app/modules/components/dashboard-runtime/dashboard-runtime.component';

@Component({
  selector: 'hs-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.less'],
  imports: [RouterModule, DashboardRuntimeComponent],
})
export class DashboardPageComponent implements OnInit {
  dashboardId: string;
  private routeSub: Subscription | null = null;

  constructor(private route: ActivatedRoute) {
    this.routeSub = this.route.params.subscribe((params) => {
      const dashboardId = params['dashboardId'];
      if (dashboardId !== this.dashboardId) {
        this.dashboardId = dashboardId;
        this.updateComponent(dashboardId);
      }
    });
  }

  updateComponent(dashboardId: string): void {
    console.log('路由参数更新，执行更新逻辑，当前 ID:', dashboardId);
  }

  ngOnInit() {}
}
