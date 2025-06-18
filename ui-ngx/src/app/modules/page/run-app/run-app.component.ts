import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from './menu/side-menu.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { HsThemeService } from '@src/app/core/services/theme.service';

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
    private hsThemeService: HsThemeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.runAppMenuService.loadMenuData(this.appId!).subscribe({
      next: (menuData: IMenuNode[]) => {        
        this.runAppMenuService.navigateToDefaultDashboard(this.appId!, menuData);
      },
      error: (err) => {

      }
    })
  }
}
