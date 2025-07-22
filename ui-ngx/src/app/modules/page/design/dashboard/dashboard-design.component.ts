import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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
  PushDirections,
  Resizable,
} from 'angular-gridster2';
import { WidgetContainerComponent } from '../widget/widget-container.component';
import {
  DashboardService,
  IDashboardWidgetContext,
} from '@src/app/core/http/dashboard.service';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { CommonModule } from '@angular/common';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { IWidgetType } from '@src/app/shared/models/widget.model';
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
  label: string,
  icon: string,
  matIcon?: boolean,
  action: Function
}

interface IContextMenu {
  [key: string]: IContextMenuConfig
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

  widgets: Array<IDashboardWidgetContext> = [];

  options: GridsterConfig;

  loadingStatus = computed(() => this.dashboardConfigService.loadingStatus());

  isRuntime = computed(() => !this.dashboardEditorService.isRuntime());

  gridsterOption = computed(() => {
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
      emptyCellDropCallback: this.emptyCellDragCallback.bind(this),
      emptyCellDragCallback: this.emptyCellDragCallback.bind(this),
    };
  });

  currentWidgetType = computed(() =>
    this.dashboardEditorService.currentWidgetType(),
  );

  selectWidgetId = computed(() =>
    this.dashboardEditorService.currentSelectWidgetId(),
  );

  gridsterItemContextMenu: IContextMenu = {
    rename: {
      label: '编辑',
      icon: 'edit',
      action: (data: any) => {
      },
    },
    copy: {
      label: '复制',
      matIcon: true,
      icon: 'file_copy',
      action: (data: any) => {
      },
    },
    remove: {
      label: '删除',
      icon: 'remove',
      action: async (data: any) => {
      },
    },
  };

  gridsterItemContextMenuArr() {
    return Object.values(this.gridsterItemContextMenu);
  }

  constructor(
    private dashboardEditorService: DashboardEditorService,
    private dashboardConfigService: DashboardConfigService,
  ) {
    effect(() => {
      if (this.dashboardConfigService.dashboardConfig().widgets) {
        this.widgets = this.dashboardConfigService.getDashboardWidgets()!;
      }
    });
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellClick(event: MouseEvent, item: IDashboardWidgetContext): void {
    console.info('empty cell click', event, item);

    this.widgets.push(item);
  }

  removeItem($event: MouseEvent | TouchEvent, item: any): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.widgets.splice(this.widgets.indexOf(item), 1);
  }

  addItem(): void {
    this.widgets.push({
      x: 0,
      y: 0,
      cols: 1,
      rows: 1,
      name: '',
      type: IWidgetType.CESIUM,
    });
  }

  // 鼠标划过网格
  emptyCellDragCallback(event: MouseEvent, item: GridsterItem) {
    console.info('empty cell click', event, item);
    this.widgets.push({ ...item, name: '', type: this.currentWidgetType() });
  }

  dragStartHandler(ev: DragEvent): void {
    // if (ev.dataTransfer) {
    //   ev.dataTransfer.setData('text/plain', 'Drag Me Button');
    //   ev.dataTransfer.dropEffect = 'copy';
    // }
  }

  selectGridster(item: IDashboardWidgetContext) {
    item.widgetId && this.dashboardEditorService.updateWidgetId(item.widgetId);
  }

  ngAfterViewInit(): void {
    this.dashboardEditorService.setGridsterInstall(this.gridster);
  }

  ngOnInit(): void {
    // this.options = {
    //   gridType: GridType.Fit,
    //   columns: 6,
    //   margin: 10,
    //   displayGrid: DisplayGrid.OnDragAndResize,
    //   enableEmptyCellClick: false,
    //   enableEmptyCellContextMenu: false,
    //   enableEmptyCellDrop: true,
    //   enableEmptyCellDrag: true,
    //   enableOccupiedCellDrop: false,
    //   emptyCellDragMaxCols: 50,
    //   emptyCellDragMaxRows: 50,
    //   emptyCellClickCallback: this.emptyCellClick.bind(this),
    //   emptyCellContextMenuCallback: this.emptyCellClick.bind(this),
    //   emptyCellDropCallback: this.emptyCellClick.bind(this),
    //   emptyCellDragCallback: () => {
    //     console.log('%c Line:70 🍎 emptyCellDragCallback', 'color:#2eafb0');
    //   },
    // };
    // this.dashboard = [
    //   {
    //     cols: 5,
    //     rows: 1,
    //     y: 0,
    //     x: 0,
    //     type: 'code',
    //     widgetId: '664098e6-703b-46e1-a789-97a0320be2f8',
    //   },
    //   {
    //     cols: 5,
    //     rows: 1,
    //     y: 0,
    //     x: 5,
    //     type: 'form',
    //     widgetId: '2cf76f03-e934-4c6d-95d8-bc2d38d0bfbb',
    //   },
    // ];
  }
}
