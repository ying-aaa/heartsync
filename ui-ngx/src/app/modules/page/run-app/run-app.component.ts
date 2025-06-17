import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from './menu/side-menu.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';

@Component({
  selector: 'hs-run-app',
  templateUrl: './run-app.component.html',
  styleUrls: ['./run-app.component.less'],
  imports: [SideMenuComponent, RouterModule, MatDividerModule],
})
export class RunAppComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);

  constructor(
    private runAppMenuService: RunAppMenuService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.runAppMenuService.loadMenuData(this.appId!).subscribe({
      next: (menuData: IMenuNode[]) => {        
        const regex = /\/dashboard\/.*/;
        const isOnDashboardPath = regex.test(this.router.url); // 返回布尔值，表示是否匹配
        if(isOnDashboardPath) return;
        const dashboardId = menuData[0].id; 
        const url = `/run-app/${this.appId}/dashboard/${dashboardId}`;
        this.router.navigate([url]);
      },
      error: (err) => {

      }
    })
  }
}
