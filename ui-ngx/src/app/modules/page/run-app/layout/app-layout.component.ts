import { Component, computed, effect, ElementRef, OnInit, signal } from '@angular/core';
import { AppContentComponent } from '../common/content/app-content.component';
import { AppHeaderComponent } from '../common/header/app-header.component';
import { SideMenuComponent } from '../common/menu/side-menu.component';
import { ActivatedRoute } from '@angular/router';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { isMobile } from '@src/app/core/utils';

@Component({
  selector: 'hs-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less'],
  imports: [SideMenuComponent, AppHeaderComponent, AppContentComponent],
})
export class AppLayoutComponent implements OnInit {
  menuData = computed(() => this.runAppMenuService.menuData());

  isDesigner = computed(() => this.runAppDesignService.isDesigner());

  menuContainerStyle = computed(() => this.runAppGlobalService.appMenuConfig().menuContainerStyle);

  headerHeight = computed(
    () => this.runAppGlobalService.appHeaderConfig().headerContainerStyle?.['height'] || 56,
  );

  isFullscreen = computed(() => this.runAppMenuService.selectedMenuNode()?.isFullscreen);

  isMobile = isMobile();

  appLayoutType = computed(() => this.runAppGlobalService.appGlobalConfig().appLayoutType);

  constructor(
    private route: ActivatedRoute,
    private hsThemeService: HsThemeService,
    private runAppMenuService: RunAppMenuService,
    private runAppGlobalService: RunAppGlobalService,
    private runAppDesignService: RunAppDesignService,
    private el: ElementRef,
  ) {
    effect(() => {
      const appId = this.runAppGlobalService.appData().id;
      this.el.nativeElement.id = appId;
    });
  }

  ngOnInit() {}
}
