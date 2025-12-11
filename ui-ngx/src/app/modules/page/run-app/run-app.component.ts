import { Component, computed, OnInit, signal } from '@angular/core';
import { SideMenuComponent } from './menu/side-menu.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { IAppConfig } from '@src/app/core/http/application.service';
import { AppHeaderComponent } from './app-header/app-header.component';
import { HsThemeService } from '@src/app/core/services/theme.service';

@Component({
  selector: 'hs-run-app',
  templateUrl: './run-app.component.html',
  styleUrls: ['./run-app.component.less'],
  imports: [SideMenuComponent, RouterModule, MatDividerModule, AppHeaderComponent],
})
export class RunAppComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);
  loadingState = signal<boolean>(false);

  menuData = computed(() => this.runAppMenuService.menuData());

  constructor(
    private runAppMenuService: RunAppMenuService,
    private hsThemeService: HsThemeService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.runAppMenuService.loadAppAndMenu(this.appId!).subscribe({
      next: ([appConfig, menuData]: [IAppConfig, IMenuNode[]]) => {},
      error: (err) => {},
    });
  }
}
