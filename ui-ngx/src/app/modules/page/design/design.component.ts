import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { WorkbenchHeaderComponent } from '../common/workbench-header/workbench-header.component';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IAppConfig } from '@src/app/core/http/application.service';
import { getParamFromRoute } from '@src/app/core/utils';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { finalize, forkJoin } from 'rxjs';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';

@Component({
  selector: 'hs-design',
  templateUrl: './design.component.html',
  imports: [WorkbenchHeaderComponent, RouterModule, MatTooltipModule],
  providers: [RunAppGlobalService, RunAppMenuService, RunAppDesignService],
})
export class DesignComponent implements OnInit {
  @ViewChild('outlet', { static: true }) outlet!: RouterOutlet;

  appId: string = getParamFromRoute('appId', this.route)!;

  appConfig = signal<IAppConfig>({} as IAppConfig);
  loadingState = signal<boolean>(false);

  imageUrl = computed(() => this.appConfig().imageUrl);
  name = computed(() => this.appConfig().name);

  hiddenMenu = false;

  constructor(
    private route: ActivatedRoute,
    private runAppGlobalService: RunAppGlobalService,
    private runAppMenuService: RunAppMenuService,
  ) {}

  ngOnInit() {
    this.loadAppConfig();
    setTimeout(() => {
      this.onActivate();
    }, 50);
  }

  onActivate() {
    const routeConfig = this.outlet.activatedRoute.routeConfig;
    this.hiddenMenu = routeConfig?.data?.['hiddenMenu'];
  }

  loadAppConfig() {
    this.loadingState.set(true);
    forkJoin([
      this.runAppGlobalService.loadAppWithConfig(this.appId),
      this.runAppMenuService.loadAppMenu(this.appId),
    ])
      .pipe(
        finalize(() => {
          this.loadingState.set(false);
        }),
      )
      .subscribe((res) => {
        console.log('%c Line:55 🧀 res', 'color:#93c0a4', res);
      });
  }
}
