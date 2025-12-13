import { Component, computed, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { appHeaderComp } from '../common/public-api';
import { AppLogoComponent } from '../common/app-logo/app-logo.component';

@Component({
  selector: 'hs-app-header',
  templateUrl: './app-header.component.html',
  imports: [MatTooltipModule, AppLogoComponent],
  host: {
    class: 'hs-header-container wh-full block',
  },
})
export class AppHeaderComponent implements OnInit {
  appConfig = computed(() => this.RunAppMenuService.appConfig());

  contentGroups = computed(() => {
    const contentGroups = this.runAppGlobalService.appHeaderConfig().contentGroups;

    return contentGroups.map((group: any) => {
      return {
        ...group,
        // component: AppLogoComponent,
      };
    });
  });

  constructor(
    private RunAppMenuService: RunAppMenuService,
    private runAppGlobalService: RunAppGlobalService,
  ) {}

  ngOnInit() {}
}
