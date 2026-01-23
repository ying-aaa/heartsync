import { Component, computed, OnInit, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
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
import { RunAppDesignService } from '@core/services/run-app-designer.service';
import { BaseDesignComponent } from '../base-design.component';
import { AppLogoComponent } from '../app-logo/app-logo.component';

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
    class: 'hs-header-container wh-full block h-56px',
  },
})
export class AppHeaderComponent extends BaseDesignComponent implements OnInit {
  isMove = signal(false);

  headerContentItems = computed(() => {
    const headerContentItems = this.runAppGlobalService.appHeaderConfig()?.headerContentItems;
    return headerContentItems || [];
  });

  protected configTypeKey = 'appHeader';

  constructor(
    private runAppGlobalService: RunAppGlobalService,
    override runAppDesignService: RunAppDesignService,
  ) {
    super(runAppDesignService);
  }

  dragStart(event: CdkDragStart<any>) {
    this.isMove.set(true);
  }

  dropEnd(event: CdkDragDrop<string[]>) {
    this.runAppGlobalService.appHeaderConfig.update((appHeaderConfig) => {
      moveItemInArray(appHeaderConfig.headerContentItems, event.previousIndex, event.currentIndex);
      return appHeaderConfig;
    });
    this.runAppDesignService.triggerSync$.next();

    this.isMove.set(false);
  }
  ngOnInit() {}
}
