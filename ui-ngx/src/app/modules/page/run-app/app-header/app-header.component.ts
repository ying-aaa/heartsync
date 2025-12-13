import { Component, computed, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { DynamicComponentDirective } from '@src/app/shared/directive/dynamic-component/dynamic-component.directive';

@Component({
  selector: 'hs-app-header',
  templateUrl: './app-header.component.html',
  imports: [MatTooltipModule, DynamicComponentDirective],
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
        component: group.component,
      };
    });
  });

  constructor(
    private RunAppMenuService: RunAppMenuService,
    private runAppGlobalService: RunAppGlobalService,
  ) {}

  ngOnInit() {}
}
