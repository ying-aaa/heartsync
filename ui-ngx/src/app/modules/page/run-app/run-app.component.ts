import { Component, computed, OnInit, signal } from '@angular/core';
import { SideMenuComponent } from './menu/side-menu.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { IAppConfig } from '@src/app/core/http/application.service';
import { AppHeaderComponent } from './header/app-header.component';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { AppPageDesignService } from '../design/app/page/app-page-designer.service';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';

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

  selectedConfigType = computed(() => this.appPageDesignService.selectedConfigType().value);

  isDesigner = computed(() => this.runAppMenuService.isDesigner());

  menuContainer = computed(() => this.runAppGlobalService.appMenuConfig().menuContainer);

  headerHeight = computed(() => this.runAppGlobalService.appHeaderConfig().headerStyle?.height);

  isFullscreen = computed(() => this.runAppMenuService.selectedMenuNode()?.isFullscreen);

  constructor(
    private route: ActivatedRoute,
    private hsThemeService: HsThemeService,
    private runAppMenuService: RunAppMenuService,
    private runAppGlobalService: RunAppGlobalService,
    private appPageDesignService: AppPageDesignService,
  ) {}

  selectConfigType(type: string) {
    if (!this.runAppMenuService.isDesigner()) return;
    this.appPageDesignService.setConfigType(type);
  }

  ngOnInit() {
    this.runAppMenuService.loadAppAndMenu(this.appId!).subscribe({
      next: ([appConfig, menuData]: [IAppConfig, IMenuNode[]]) => {},
      error: (err) => {},
    });
  }
}
