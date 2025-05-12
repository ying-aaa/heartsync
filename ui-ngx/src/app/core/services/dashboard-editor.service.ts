import { effect, Injectable, signal } from '@angular/core';
import { IWidgetType } from '@src/app/shared/models/widget.model';
import { GridsterComponent } from 'angular-gridster2';

@Injectable({
  providedIn: 'root',
})
export class DashboardEditorService {
  public currentDashboardId = signal<string>('');

  currentWidgetType = signal<IWidgetType>(IWidgetType.CESIUM);

  currentSelectWidgetId = signal<string>('');

  gridsterInstall: GridsterComponent;

  isRuntime = signal(false);

  constructor() { }

  setGridsterInstall(gridsterInstall: GridsterComponent) {
    this.gridsterInstall = gridsterInstall;
  }

  updateWidgetType(type: IWidgetType) {
    if (type === this.currentWidgetType()) return;
    this.currentWidgetType.set(type);
  }

  updateDashboardId(dahsboardId: string) {
    if (dahsboardId === this.currentDashboardId()) return;
    this.currentDashboardId.set(dahsboardId);
  }

  updateWidgetId(widgetId: string) {
    this.currentSelectWidgetId.set(widgetId);
  }

  resizeGridster() {
    this.gridsterInstall?.onResize();
  }
}
