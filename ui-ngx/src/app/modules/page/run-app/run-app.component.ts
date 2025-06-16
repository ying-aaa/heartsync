import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from './menu/side-menu.component';
import { MenuService } from '@src/app/core/services/menu.service';
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
  dashboardId: string | null = getParamFromRoute('dashboardId', this.route);

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.menuService.loadMenuData(this.appId!).subscribe({
      next: (menuData: IMenuNode[]) => {
        console.log("%c Line:29 🍎 this.dashboardId", "color:#4fff4B", this.route);
        if(this.dashboardId) return;
        const dashboardId = menuData[0].id; 
        const url = `/run-app/${this.appId}/dashboard/${dashboardId}`;
        this.router.navigate([url]);
      },
      error: (err) => {

      }
    })
  }
}
