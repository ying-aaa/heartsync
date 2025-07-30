import {
  AfterViewInit,
  Component,
  computed,
  effect,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';

import {
  Draggable,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterItemComponentInterface,
  PushDirections,
  Resizable,
} from 'angular-gridster2';
import { WidgetContainerComponent } from '../widget/widget-container.component';
import { IDashboardWidgetContext } from '@src/app/core/http/dashboard.service';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { CommonModule } from '@angular/common';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { MatMenuModule } from '@angular/material/menu';
import { CdkMenu, CdkMenuItem, CdkContextMenuTrigger } from '@angular/cdk/menu';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { MatDividerModule } from '@angular/material/divider';

interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}

interface IContextMenuConfig {
  label: string;
  icon: string;
  matIcon?: boolean;
  action: Function;
}

interface IContextMenu {
  [key: string]: IContextMenuConfig;
}

@Component({
  selector: 'hs-dashboard-design',
  templateUrl: './dashboard-design.component.html',
  styleUrls: ['./dashboard-design.component.less'],
  imports: [
    CdkMenu,
    HsSvgModule,
    CdkMenuItem,
    FormsModule,
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    HsLoadingModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    GridsterComponent,
    CdkContextMenuTrigger,
    GridsterItemComponent,
    WidgetContainerComponent,
  ],
})
export class DashboardDesignComponent implements OnInit, AfterViewInit {
  @ViewChild(GridsterComponent) gridster: GridsterComponent;

  public widgets: Array<IDashboardWidgetContext> = [];

  loadingStatus = computed(() => this.dashboardConfigService.loadingStatus());

  isRuntime = computed(() => !this.dashboardEditorService.isRuntime());

  selectWidgetId = computed(() =>
    this.dashboardEditorService.currentSelectWidgetId(),
  );

  gridsterItemContextMenu: IContextMenu = {
    rename: {
      label: '编辑',
      icon: 'edit',
      action: (data: any) => {},
    },
    copy: {
      label: '复制',
      matIcon: true,
      icon: 'file_copy',
      action: (data: any) => {},
    },
    remove: {
      label: '删除',
      icon: 'remove',
      action: async (data: any) => {},
    },
  };

  gridsterOption = computed<GridsterConfig>(() => {
    const isRuntime = this.isRuntime();
    return {
      // 取自定义配置，即后端保存的
      ...this.dashboardConfigService.gridsterOption(),
      /**
       * 下面为编辑时的配置，不会进行保存的
       *  */
      // 拖拽生成
      enableEmptyCellDrop: isRuntime,
      // 滑动生成
      enableEmptyCellDrag: isRuntime,
      draggable: {
        enabled: isRuntime,
      },
      resizable: {
        enabled: isRuntime,
      },
      // 拖拽预设到网格时的回调
      emptyCellDropCallback: this.onPresetDropToGrid.bind(this),
      // 滑动网格生成时的回调
      emptyCellDragCallback: this.onSwipeSpawnGrid.bind(this),
      // 变动网格item
      itemChangeCallback: this.itemChangeCallback.bind(this),
    };
  });

  constructor(
    private dashboardEditorService: DashboardEditorService,
    private dashboardConfigService: DashboardConfigService,
  ) {
    effect(() => {
      const dashboardConfig = this.dashboardConfigService.dashboardConfig();
      if (dashboardConfig.widgets) {
        this.widgets = this.dashboardConfigService.getDashboardWidgets()!;
      }
    });
  }

  // 部件右键的菜单功能
  gridsterItemContextMenuArr() {
    return Object.values(this.gridsterItemContextMenu);
  }

  // 点击空白
  emptyCellClick(event: MouseEvent, item: IDashboardWidgetContext): void {
    console.info('empty cell click', event, item);
    this.widgets.push(item);
  }

  // 拖拽预设到网格时的回调
  onPresetDropToGrid(event: MouseEvent, item: GridsterItem) {
    const currentPresetWidgetType = this.dashboardEditorService.currentPresetWidgetType();
    console.log("%c Line:163 🥓 currentPresetWidgetType", "color:#ea7e5c", currentPresetWidgetType);

    this.widgets.push({ ...item, name: '', type: currentPresetWidgetType });
  }

  // 滑动网格生成时的回调
  onSwipeSpawnGrid(event: MouseEvent, item: GridsterItem) {
    const currentWidgetType = this.dashboardEditorService.currentWidgetType();
    console.log("%c Line:170 🥕 currentWidgetType", "color:#3f7cff", currentWidgetType);

    this.widgets.push({ ...item, name: '', type: currentWidgetType });
  }

  // 变动网格item
  itemChangeCallback(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
  ): void {
    console.log('%c Line:173 🌭', 'color:#93c0a4', '变动网格item');
    // this.dashboardConfigService.updateWidgets(this.widgets);
  }

  // 删除部件
  removeItem($event: MouseEvent | TouchEvent, item: any): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.widgets.splice(this.widgets.indexOf(item), 1);
  }

  // 新增部件
  // addItem(): void {
  //   this.widgets.push({
  //     x: 0,
  //     y: 0,
  //     cols: 1,
  //     rows: 1,
  //     name: '',
  //     type: IWidgetType.CESIUM,
  //   });
  // }

  // 拖拽操作
  dragStartHandler(ev: DragEvent): void {
    // if (ev.dataTransfer) {
    //   ev.dataTransfer.setData('text/plain', 'Drag Me Button');
    //   ev.dataTransfer.dropEffect = 'copy';
    // }
  }

  // 选中网格部件
  selectGridster(item: IDashboardWidgetContext) {
    item.widgetId && this.dashboardEditorService.updateWidgetId(item.widgetId);
  }

  ngAfterViewInit(): void {
    this.dashboardEditorService.setGridsterInstall(this.gridster);
  }

  ngOnInit(): void {
    this.dashboardConfigService.setDashboardDesignInstall(this);
  }
}
