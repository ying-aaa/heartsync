import { Injectable, signal } from '@angular/core';
import { IWidgetType } from '@src/app/shared/models/widget.model';
import { GridsterComponent } from 'angular-gridster2';
@Injectable({
  providedIn: 'root',
})
export class DashboardEditorService {
  public currentDashboardId = signal<string>('');

  public currentDashboardName = signal<string>('');

  currentWidgetType = signal<IWidgetType>(IWidgetType.CODE);

  currentDragstartWidgetType = signal<IWidgetType>(IWidgetType.CODE);

  currentDragstartWidgetId = signal<string>('');

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

  updateDragstartWidgetType(type: IWidgetType) {
    if (type === this.currentDragstartWidgetType()) return;
    this.currentDragstartWidgetType.set(type);
  }

  updateDragstartWidgetId(widgetId: string) {
    if (widgetId === this.currentDragstartWidgetId()) return;
    this.currentDragstartWidgetId.set(widgetId);
  }

  // 更新仪表板ID
  updateDashboardId(dahsboardId: string) {
    if (dahsboardId === this.currentDashboardId()) return;
    this.currentDashboardId.set(dahsboardId);
  }

  // 更新仪表板名称
  updateDashboardName(name: string) {
    if (name === this.currentDashboardName()) return;
    this.currentDashboardName.set(name);
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
