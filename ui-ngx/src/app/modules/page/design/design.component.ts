import { Component, computed, OnInit, signal } from '@angular/core';
import { WorkbenchHeaderComponent } from '../common/workbench-header/workbench-header.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getParamFromRoute } from '@src/app/core/utils';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { finalize, forkJoin } from 'rxjs';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ImgUrlPipe } from "@shared/pipes/img-url.pipe";

@Component({
  selector: 'hs-design',
  templateUrl: './design.component.html',
  imports: [WorkbenchHeaderComponent, RouterModule, MatTooltipModule, MatProgressSpinnerModule, ImgUrlPipe],
  providers: [RunAppGlobalService, RunAppMenuService, RunAppDesignService],
})
export class DesignComponent implements OnInit {
  appId: string = getParamFromRoute('appId', this.route)!;

  loadingState = signal<boolean>(false);

  imageUrl = computed(() => this.runAppGlobalService.appData().imageUrl);
  name = computed(() => this.runAppGlobalService.appData().name);

  constructor(
    private route: ActivatedRoute,
    private runAppGlobalService: RunAppGlobalService,
    private runAppMenuService: RunAppMenuService,
  ) {}

  ngOnInit() {
    this.loadAppConfig();
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
