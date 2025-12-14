import { Component, computed, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { AppLogoComponent } from '../common/app-logo/app-logo.component';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';

@Component({
  selector: 'hs-app-header',
  templateUrl: './app-header.component.html',
  imports: [MatTooltipModule, AppLogoComponent, ConcatUnitsPipe],
  host: {
    class: 'hs-header-container wh-full block',
  },
})
export class AppHeaderComponent implements OnInit {
  appConfig = computed(() => this.runAppMenuService.appConfig());

  isDesigner = computed(() => this.runAppMenuService.isDesigner());

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
    private runAppMenuService: RunAppMenuService,
    private runAppGlobalService: RunAppGlobalService,
  ) {}

  ngOnInit() {}
}
