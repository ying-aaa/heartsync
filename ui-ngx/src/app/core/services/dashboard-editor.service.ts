import { Injectable, signal } from '@angular/core';
import { IWidgetType } from '@src/app/shared/models/widget.model';
import { GridsterComponent } from 'angular-gridster2';
@Injectable({
  providedIn: 'root',
})
export class DashboardEditorService {
  public currentDashboardId = signal<string>('');

  currentWidgetType = signal<IWidgetType>(IWidgetType.CODE);

  currentPresetWidgetType = signal<IWidgetType>(IWidgetType.CODE);

  currentSelectWidgetId = signal<string>('');

  gridsterInstall: GridsterComponent;

  isRuntime = signal(true);

  constructor() {}

  updateRuntimeStatus(is: boolean) {
    if (is === this.isRuntime()) return;
    this.isRuntime.set(is);
  }

  setGridsterInstall(gridsterInstall: GridsterComponent) {
    this.gridsterInstall = gridsterInstall;
  }

  updateWidgetType(type: IWidgetType) {
    if (type === this.currentWidgetType()) return;
    this.currentWidgetType.set(type);
  }

  updatePresetWidgetType(type: IWidgetType) {
    if (type === this.currentPresetWidgetType()) return;
    this.currentPresetWidgetType.set(type);
  }

  // 更新仪表板ID
  updateDashboardId(dahsboardId: string) {
    if (dahsboardId === this.currentDashboardId()) return;
    this.currentDashboardId.set(dahsboardId);
  }

  // 更新当前选中的小部件ID
  updateWidgetId(widgetId: string) {
    this.currentSelectWidgetId.set(widgetId);
  }

  // 触发Gridster的onResize事件
  resizeGridster() {
    this.gridsterInstall?.onResize();
  }
}
