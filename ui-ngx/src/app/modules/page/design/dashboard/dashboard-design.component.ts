import {
  input,
  effect,
  OnInit,
  signal,
  computed,
  ViewChild,
  Component,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';
import {
  GridType,
  GridsterItem,
  GridsterConfig,
  GridsterComponent,
  GridsterItemComponent,
  GridsterItemComponentInterface,
} from 'angular-gridster2';
import { IDashboardWidgetContext } from '@src/app/core/http/dashboard.service';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { CommonModule } from '@angular/common';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { MatMenuModule } from '@angular/material/menu';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { MatDividerModule } from '@angular/material/divider';
import { deepClone, generateUUID, isMobile } from '@src/app/core/utils';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DashboardWidgetDesignComponent } from './dashboard-widget-design.component';
import { IDashboardWidgetConfig } from '@heartsync/types';
import { A11yModule } from '@angular/cdk/a11y';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, share } from 'rxjs/operators';

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
    DashboardWidgetDesignComponent,
    A11yModule,
  ],
})
export class DashboardDesignComponent implements OnInit, AfterViewInit {
  @ViewChild(GridsterComponent, {
    static: true,
  })
  gridster: GridsterComponent;

  isMobile = input<boolean>(isMobile());

  gridsterWidgets = this.dashboardConfigService.gridsterWidgets;

  widgets = computed(() => this.dashboardConfigService.widgets());

  loadingStatus = computed(() => this.dashboardConfigService.loadingStatus());

  isRuntime = computed(() => this.dashboardEditorService.isRuntime());

  selectWidgetId = computed(() => this.dashboardEditorService.currentSelectWidgetId());

  fixedRowHeight = signal<number>(70);

  private scrollSubscription?: Subscription;

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
    const gridsterOption = deepClone(this.dashboardConfigService.gridsterOption());
    const fixedRowHeight = this.detectRowSize(gridsterOption) || 70;
    if (isDesign) {
      // 编辑模式滚动
      gridsterOption.gridType = GridType.ScrollVertical;
    } else if (this.isMobile() && gridsterOption.gridType === GridType.Fit) {
      // 手机端固定高度
      gridsterOption.gridType = GridType.Fixed;
    }

    const baseDrag = {
      enabled: isDesign,
      start: () => {},
      stop: () => {},
    };

    const options: GridsterConfig = {
      // 取自定义配置，即后端保存的
      ...gridsterOption,
      keepFixedHeightInMobile: this.isRuntime() && this.isMobile(),
      useTransformPositioning: true, // 开启硬件加速
      // 除了 fixed
      rowHeight: '70px',
      // fixed
      fixedRowHeight,
      compactType: 'none',
      disableWindowResize: false,
      allowMultiLayer: true,
      defaultLayerIndex: 2,
      baseLayerIndex: 2,
      maxLayerIndex: 2,
      /**
       * 下面为编辑时的配置，不会进行保存的
       *  */
      // 拖拽生成
      enableEmptyCellDrop: isDesign,
      // 滑动生成
      enableEmptyCellDrag: isDesign,
      draggable: baseDrag,
      resizable: baseDrag,
      // 拖拽预设到网格时的回调
      emptyCellDropCallback: this.onPresetDropToGrid.bind(this),
      // 滑动网格生成时的回调
      // emptyCellDragCallback: this.onSwipeSpawnGrid.bind(this),
      // 变动网格item
      itemChangeCallback: this.itemChangeCallback.bind(this),
    };

    return options;
  });

  constructor(
    private dashboardEditorService: DashboardEditorService,
    private dashboardConfigService: DashboardConfigService,
    private renderer: Renderer2,
  ) {
    effect(() => {
      const gridsterOption = this.gridsterOption();
      this.dashboardEditorService.resizeGridster();
    });
  }

  private detectRowSize(gridsterOpts: GridsterConfig): number | null {
    const isMobile = this.isMobile();
    const gridsterHeight = this.gridster?.el.offsetHeight;
    let rowHeight = null;
    if (gridsterHeight) {
      let totalRows = 0;
      for (const widget of this.gridsterWidgets()) {
        totalRows += widget.rows;
      }
      // 核心公式：行高 = (容器高度 - 间距总占用) / 总行数
      rowHeight =
        (gridsterHeight -
          (gridsterOpts.margin || 10) * (totalRows + (gridsterOpts.outerMargin ? 1 : -1))) /
        totalRows;
    }
    return rowHeight;
  }

  // 部件右键的菜单功能
  gridsterItemContextMenuArr() {
    return Object.values(this.gridsterItemContextMenu);
  }

  /**
   * 拖拽预设到网格时的回调，通过在widget-preset-list组件监听document全局拖拽事件获取元素id
   * @param event 鼠标事件
   * @param item 网格项
   */
  onPresetDropToGrid(event: MouseEvent, item: GridsterItem) {
    const widgetType = this.dashboardEditorService.currentDragstartWidgetType();
    const widgetId = this.dashboardEditorService.currentDragstartWidgetId();
    const isNew = this.dashboardEditorService.isNew;
    const widget = {
      ...item,
      name: '',
      layerIndex: 0,
      type: widgetType,
      id: generateUUID(),
      isNew: isNew ? 1 : 0,
    } as IDashboardWidgetConfig;
    if (widgetId) {
      widget.widgetId = widgetId;
    }
    this.dashboardConfigService.addWidget(widget);
  }

  // 滑动网格生成时的回调
  onSwipeSpawnGrid(event: MouseEvent, item: GridsterItem) {
    const widgetType = this.dashboardEditorService.widgetType();
    const widget = { ...item, name: '', type: widgetType } as IDashboardWidgetConfig;
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
    if (this.isRuntime()) return;
    item.id && this.dashboardEditorService.updateWidgetId(item.id);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.dashboardEditorService.setGridsterInstall(this.gridster);
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
