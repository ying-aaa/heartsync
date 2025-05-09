import { Injectable, signal } from '@angular/core';
import { IWidgetType } from '@src/app/shared/models/widget.model';
import { GridsterComponent } from 'angular-gridster2';

@Injectable({
  providedIn: 'root',
})
export class DashboardEditorService {
  currentWidgetType = signal<IWidgetType>(IWidgetType.CESIUM);

  gridsterInstall: GridsterComponent;

  constructor() {}

  setGridsterInstall(gridsterInstall: GridsterComponent) {
    this.gridsterInstall = gridsterInstall;
  }

  updateWidgetType(type: IWidgetType) {
    if (type === this.currentWidgetType()) return;
    this.currentWidgetType.set(type);
  }

  resizeGridster() {
    this.gridsterInstall?.onResize();
  }
}
