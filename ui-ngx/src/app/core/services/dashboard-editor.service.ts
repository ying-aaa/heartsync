import { Injectable, signal } from '@angular/core';
import { IWidgetType } from '@src/app/shared/models/widget.model';
import { GridsterComponent } from 'angular-gridster2';
@Injectable()
export class DashboardEditorService {
  public currentDashboardId = signal<string>('');

  public currentDashboardName = signal<string>('');

  widgetType = signal<IWidgetType>(IWidgetType.CODE);

  currentDragstartWidgetType = signal<IWidgetType>(IWidgetType.CODE);

  currentDragstartWidgetId = signal<string | null>(null);

  currentSelectWidgetId = signal<string>('');

  gridsterInstall: GridsterComponent;

  // 当前运行状态
  isRuntime = signal(true);

  // 新创建的部件
  isNew: boolean = false;

  // 是否开启部件配置
  widgetConfigOpen = signal(false);

  // 是否开启仪表板列表
  dashboardListOpen = signal(true);

  // 是否开启部件列表
  widgetListOpen = signal(false);

  constructor() {}

  updateRuntimeStatus(is: boolean) {
    if (is === this.isRuntime()) return;
    this.isRuntime.set(is);
    // setTimeout(() => {
    //   this.resizeGridster();
    // }, 50);
  }

  // 更新widget配置的打开状态
  updateWidgetConfigStatus(is: boolean) {
    if (is === this.widgetConfigOpen()) return;
    this.widgetConfigOpen.set(is);
  }

  // 更新仪表板列表的打开状态
  updateDashboardListOpen(is: boolean) {
    if (is === this.dashboardListOpen()) return;
    this.dashboardListOpen.set(is);
  }

  // 更新部件列表的打开状态
  updateWidgetListOpen(is: boolean) {
    if (is === this.widgetListOpen()) return;
    this.widgetListOpen.set(is);
  }

  setGridsterInstall(gridsterInstall: GridsterComponent) {
    this.gridsterInstall = gridsterInstall;
  }

  updateWidgetType(type: IWidgetType) {
    if (type === this.widgetType()) return;
    this.widgetType.set(type);
  }

  updateDragstartWidgetType(type: IWidgetType) {
    if (type === this.currentDragstartWidgetType()) return;
    this.currentDragstartWidgetType.set(type);
  }

  updateDragstartWidgetId(widgetId: string | null) {
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
  updateWidgetId(id: string) {
    this.currentSelectWidgetId.set(id);
  }

  // 触发Gridster的onResize事件
  resizeGridster() {
    this.gridsterInstall?.onResize();
  }
}
