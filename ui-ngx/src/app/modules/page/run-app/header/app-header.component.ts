import { Component, computed, OnInit, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { AppLogoComponent } from '../common/app-logo/app-logo.component';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDragStart,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'hs-app-header',
  templateUrl: './app-header.component.html',
  imports: [
    MatTooltipModule,
    AppLogoComponent,
    ConcatUnitsPipe,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    CdkDragPreview,
  ],
  host: {
    class: 'hs-header-container wh-full block',
  },
})
export class AppHeaderComponent implements OnInit {
  appConfig = computed(() => this.runAppMenuService.appConfig());

  isDesigner = computed(() => this.runAppMenuService.isDesigner());

  isMove = signal(false);

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

  dragStart(event: CdkDragStart<any>) {
    this.isMove.set(true);
  }

  dropEnd(event: CdkDragDrop<string[]>) {
    const contentGroups = this.runAppGlobalService.appHeaderConfig().contentGroups;
    moveItemInArray(contentGroups, event.previousIndex, event.currentIndex);
    this.runAppGlobalService.appHeaderConfig.update((appHeaderConfig) => {
      appHeaderConfig.contentGroups = contentGroups;
      return { ...appHeaderConfig };
    });
    this.isMove.set(false);
  }
  ngOnInit() {}
}
