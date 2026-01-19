import {
  AfterViewInit,
  Component,
  computed,
  effect,
  OnInit,
  signal,
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
  GridType,
  PushDirections,
  Resizable,
} from 'angular-gridster2';
import { IDashboardWidgetContext } from '@src/app/core/http/dashboard.service';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { CommonModule } from '@angular/common';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { MatMenuModule } from '@angular/material/menu';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { MatDividerModule } from '@angular/material/divider';
import { isMobile } from '@src/app/core/utils';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Subscription } from 'rxjs';
import { MediaBreakpoints } from '@src/app/shared/models/constants';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DashboardWidgetDesignComponent } from "./dashboard-widget-design.component";

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
    NgScrollbarModule,
    GridsterItemComponent,
    DashboardWidgetDesignComponent
],
})
export class DashboardDesignComponent implements OnInit, AfterViewInit {
  @ViewChild(GridsterComponent) gridster: GridsterComponent;

  // public widgets: Array<IDashboardWidgetContext> = [];

  widgets = this.dashboardConfigService.widgets;

  loadingStatus = computed(() => this.dashboardConfigService.loadingStatus());

  isRuntime = computed(() => this.dashboardEditorService.isRuntime());

  selectWidgetId = computed(() => this.dashboardEditorService.currentSelectWidgetId());

  fixedRowHeight = signal<number>(70);

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
      action: this.removeItem.bind(this),
    },
  };

  gridsterOption = computed<GridsterConfig>(() => {
    const isDesign = !this.isRuntime();
    const gridsterOption = this.dashboardConfigService.gridsterOption();
    const fixedRowHeight = this.fixedRowHeight();
    return {
      // 取自定义配置，即后端保存的
      ...gridsterOption,
      gridType: GridType.Fit,
      keepFixedHeightInMobile: true,
      useTransformPositioning: true, // 开启硬件加速
      rowHeight: '100px',
      fixedRowHeight,
      compactType: 'none',
      disableWindowResize: false,
      allowMultiLayer: true,
      defaultLayerIndex: 2,
      baseLayerIndex: 2,
      maxLayerIndex: 2,
      outerMargin: true,
      /**
       * 下面为编辑时的配置，不会进行保存的
       *  */
      // 拖拽生成
      enableEmptyCellDrop: isDesign,
      // 滑动生成
      enableEmptyCellDrag: isDesign,
      draggable: {
        enabled: isDesign,
      },
      resizable: {
        enabled: isDesign,
      },
      // 拖拽预设到网格时的回调
      emptyCellDropCallback: this.onPresetDropToGrid.bind(this),
      // 滑动网格生成时的回调
      // emptyCellDragCallback: this.onSwipeSpawnGrid.bind(this),
      // 变动网格item
      itemChangeCallback: this.itemChangeCallback.bind(this),
    };
  });

  breakpointObserverSubscription: Subscription;

  constructor(
    private dashboardEditorService: DashboardEditorService,
    private dashboardConfigService: DashboardConfigService,
    private breakpointObserver: BreakpointObserver,
  ) {
    effect(() => {
      const gridsterOption = this.gridsterOption();
      this.dashboardEditorService.resizeGridster();
    });

    this.breakpointObserverSubscription = this.breakpointObserver
      .observe(MediaBreakpoints['gt-sm'])
      .subscribe(() => {
        const fixedRowHeight = this.detectRowSize(this.gridsterOption(), isMobile(), true);
        fixedRowHeight && this.fixedRowHeight.set(fixedRowHeight);
      });
  }

  test() {
    console.log('%c Line:155 🍺', 'color:#7f2b82');
  }

  private detectRowSize(
    gridsterOpts: GridsterConfig,
    isMobile: boolean,
    autofillHeight: boolean,
    parentHeight?: number,
  ): number | null {
    let rowHeight = null;
    if (!autofillHeight) {
      // 未启用自动填充：移动端使用配置的mobileRowHeight（默认70px）
      if (isMobile) {
        // rowHeight = isDefined(this.mobileRowHeight) ? this.mobileRowHeight : 70;
        rowHeight = 70;
      }
    } else if (autofillHeight && isMobile) {
      // 启用移动端自动填充：计算行高以填满容器
      if (!parentHeight) {
        parentHeight = this.gridster.el.offsetHeight; // 获取容器高度
      }
      if (parentHeight) {
        // 计算所有活跃部件的总行数
        let totalRows = 0;
        for (const widget of this.widgets()) {
          totalRows += widget.rows;
        }
        console.log(
          '%c Line:211 🍣',
          'color:#7f2b82',
          totalRows,
          (gridsterOpts.margin || 10) * (totalRows + (gridsterOpts.outerMargin ? 1 : -1)),
        );
        // 核心公式：行高 = (容器高度 - 间距总占用) / 总行数
        rowHeight =
          (parentHeight -
            (gridsterOpts.margin || 10) * (totalRows + (gridsterOpts.outerMargin ? 1 : -1))) /
          totalRows;
      }
    }
    return rowHeight;
  }

  // 部件右键的菜单功能
  gridsterItemContextMenuArr() {
    return Object.values(this.gridsterItemContextMenu);
  }

  // 拖拽预设到网格时的回调
  onPresetDropToGrid(event: MouseEvent, item: GridsterItem) {
    const widgetType = this.dashboardEditorService.currentDragstartWidgetType();
    const widgetId = this.dashboardEditorService.currentDragstartWidgetId();
    const widget = { ...item, name: '', type: widgetType, widgetId };
    this.dashboardConfigService.addWidget(widget);
  }

  // 滑动网格生成时的回调
  onSwipeSpawnGrid(event: MouseEvent, item: GridsterItem) {
    const widgetType = this.dashboardEditorService.widgetType();
    const widget = { ...item, name: '', type: widgetType };
    this.dashboardConfigService.addWidget(widget);
  }

  // 变动网格item
  itemChangeCallback(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    console.log('%c Line:173 🌭', 'color:#93c0a4', '变动网格item');
    // this.dashboardConfigService.updateWidgets(this.widgets);
  }

  // 删除部件
  removeItem($event: MouseEvent | TouchEvent, widget: any): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboardConfigService.removeWidget(widget);
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
    if(this.isRuntime()) return;
    item.widgetId && this.dashboardEditorService.updateWidgetId(item.widgetId);
  }

  ngAfterViewInit() {
    this.dashboardEditorService.setGridsterInstall(this.gridster);
    setTimeout(() => {
      const fixedRowHeight = this.detectRowSize(this.gridsterOption(), isMobile(), true);
      fixedRowHeight && this.fixedRowHeight.set(fixedRowHeight);
    }, 2000);
  }

  ngOnInit() {}
}
