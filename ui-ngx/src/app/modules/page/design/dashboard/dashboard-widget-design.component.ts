import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
  EventEmitter,
  Output,
  ViewEncapsulation,
  ComponentRef,
  ViewContainerRef,
} from '@angular/core';
import { GridsterComponent, GridsterItemComponentInterface } from 'angular-gridster2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { WidgetContainerComponent } from '@src/app/modules/components/widget-container/widget-container.component';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { IWidgetTypesConfig } from '@heartsync/types';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import ITooltipsterInstance = JQueryTooltipster.ITooltipsterInstance;
import { isMobile } from '@src/app/core/utils';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardWidgetConfigComponent } from './dashboard-widget-config.component';

@Component({
  selector: 'hs-dashboard-widget-design',
  templateUrl: './dashboard-widget-design.component.html',
  styleUrls: ['./dashboard-widget-design.component.less'],
  imports: [
    MatMenuModule,
    MatIconModule,
    OverlayModule,
    MatButtonModule,
    WidgetContainerComponent,
    MatDialogModule,
  ],
})
export class DashboardWidgetDesignComponent implements OnInit, OnDestroy {
  gridster = input.required<GridsterComponent>();
  gridsterItem = input.required<GridsterItemComponentInterface>();
  gridsterWidgets = input.required<any>({});
  widget = input.required<IWidgetTypesConfig>({});
  isRuntime = input.required<boolean>();

  hovered = false;

  selectWidgetId = computed(() => this.dashboardEditorService.currentSelectWidgetId());
  isActive = computed(() => this.selectWidgetId() === this.gridsterWidgets().id);
  widgetConfig = computed(() => ({
    ...this.widget(),
    settings: this.gridsterWidgets().settings,
  }));

  private editWidgetActionsTooltip: ITooltipsterInstance;

  constructor(
    private dashboardEditorService: DashboardEditorService,
    private dashboardConfigService: DashboardConfigService,
    private scriptService: ScriptLoaderService,
    private container: ViewContainerRef,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
  ) {
    effect(() => {
      const isActive = this.isActive();
      const isRuntime = this.isRuntime();

      if (this.editWidgetActionsTooltip) {
        if (isActive && !isRuntime) {
          this.editWidgetActionsTooltip.option('delay', [0, 10000000]);
          this.editWidgetActionsTooltip.option('triggerClose', {
            mouseleave: false,
          });
          this.editWidgetActionsTooltip.open();
        } else {
          this.editWidgetActionsTooltip.option('delay', [0, 100]);
          this.editWidgetActionsTooltip.option('triggerClose', {
            mouseleave: true,
          });
          this.editWidgetActionsTooltip.close();
        }
      }
    });
  }

  private initWidgetEditActionTooltip() {
    const parent = document.querySelector('#dashboardContainer')!;
    let componentRef: ComponentRef<EditWidgetActionsTooltipComponent>;
    this.scriptService.loadScripts(['jquery.min.js', 'tooltipster.bundle.min.js']).subscribe(() => {
      $(this.gridsterItem().el).tooltipster({
        parent: $(parent), // 提示框的父容器，用于限定定位范围
        // 延迟规则：选中时隐藏延迟极大（几乎不自动关），未选中时隐藏延迟100ms
        delay: this.isActive() ? [0, 10000000] : [0, 100],
        distance: 2, // 提示框与目标元素的距离（2px）
        zIndex: 151, // 层级，确保提示框在最上层
        arrow: false, // 隐藏提示框默认的小箭头
        theme: ['hs-widget-edit-active-tooptip'], // 自定义CSS主题类名
        interactive: true, // 允许提示框内元素交互（比如点击按钮）
        trigger: 'custom', // 自定义触发方式，不再用默认的hover/click
        triggerOpen: { mouseenter: true }, // 鼠标移入目标元素时打开
        triggerClose: { mouseleave: true }, // 鼠标移出目标元素时关闭

        side: ['top'],
        trackOrigin: true,
        trackerInterval: 25,
        viewportAware: false,
        content: '',

        functionPosition: (instance, helper, position) => {
          const clientRect = helper.origin.getBoundingClientRect();
          const container = parent.getBoundingClientRect();

          position.coord.left = Math.max(
            0,
            clientRect.right - position.size.width - container.left,
          );
          position.coord.top = position.coord.top - container.top;
          position.target = clientRect.right;
          helper.tooltip!.style.visibility = this.isRuntime() ? 'hidden' : 'visible';
          return position;
        },

        functionReady: (_instance, helper) => {
          const tooltipEl = $(helper.tooltip!);
          tooltipEl.on('mouseenter', () => {
            this.hovered = true;
            this.cd.markForCheck();
          });
          tooltipEl.on('mouseleave', () => {
            this.hovered = false;
            this.cd.markForCheck();
          });
        },

        functionAfter: () => {
          this.hovered = false;
          this.cd.markForCheck();
        },

        functionBefore: () => {},
      });
      this.editWidgetActionsTooltip = $(this.gridsterItem().el).tooltipster('instance');
      componentRef = this.container.createComponent(EditWidgetActionsTooltipComponent);
      componentRef.setInput('container', this);
      componentRef.instance.cd.detectChanges();
      componentRef.instance.viewInited.subscribe(() => {
        if (this.editWidgetActionsTooltip.status().open) {
          this.editWidgetActionsTooltip.reposition();
        }
      });
      this.editWidgetActionsTooltip.on('destroyed', () => {
        componentRef.destroy();
      });
      const parentElement = componentRef.instance.element.nativeElement;
      const content = parentElement.firstChild;
      parentElement.removeChild(content!);
      parentElement.style.display = 'none';
      this.editWidgetActionsTooltip.content(content);
    });
    // });
  }

  editItem($event: MouseEvent | TouchEvent, widget: any): void {
    // $event.preventDefault();
    // $event.stopPropagation();
    // this.dashboardEditorService.updateDragstartWidgetId(widget.id);
    // this.dashboardEditorService.updateDragstartWidgetType(widget.type);
    // const width = isMobile() ? '100vw' : '1200px';
    // const height = isMobile() ? '100vh' : '100vh';
    // const dialogRef = this.dialog.open(DashboardWidgetConfigComponent, {
    //   width,
    //   height,
    //   minWidth: width,
    //   minHeight: height,
    //   position: { right: '0' },
    //   panelClass: 'hs-drawer-container',
    //   autoFocus: false,
    //   data: {
    //     type: 'widget',
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {});

    this.dashboardEditorService.updateWidgetConfigStatus(true);
  }

  removeItem($event: MouseEvent | TouchEvent, widget: any): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboardConfigService.removeWidget(widget);
  }

  ngOnInit() {
    this.initWidgetEditActionTooltip();
  }

  ngOnDestroy(): void {
    if (this.editWidgetActionsTooltip && !this.editWidgetActionsTooltip.status().destroyed) {
      this.editWidgetActionsTooltip.destroy();
    }
  }
}

@Component({
  template: ` <div class="w-full pb-2px relative top-2px z-99999">
    <div class="hs-toolbar-wrapper w-full flex items-center justify-between">
      <div
        class="toolbar-container shadow-md bg-[var(--base-bg-color)] rounded-t-6px p-2px"
        [attr.data-widget-id]="gridsterWidgets().widgetId"
      >
        <button mat-icon-button class="hs-icon-button-32" [matMenuTriggerFor]="MoreVert">
          <mat-icon class="material-icons-round"> more_vert </mat-icon>
        </button>
        <mat-menu #MoreVert="matMenu">
          <div class="ml-12px mb-8px">
            当前层数:
            <span class="ml-10px">{{
              gridsterWidgets().layerIndex === undefined ? 1 : gridsterWidgets().layerIndex
            }}</span>
          </div>
          <button mat-menu-item (click)="gridsterItem().bringToFront(1)">
            <mat-icon>arrow_upward</mat-icon>
            向上一层
          </button>
          <button mat-menu-item (click)="gridsterItem().sendToBack(1)">
            <mat-icon>arrow_downward</mat-icon>
            向下一层
          </button>
        </mat-menu>
      </div>
      <div
        class="toolbar-containe shadow-md bg-[var(--base-bg-color)] rounded-t-6px p-2px"
        [attr.data-widget-id]="gridsterWidgets().widgetId"
      >
        <button
          mat-icon-button
          class="hs-icon-button-32"
          (click)="container().editItem($event, gridsterWidgets())"
        >
          <mat-icon class="material-icons-round"> edit </mat-icon>
        </button>
        <button mat-icon-button class="hs-icon-button-32">
          <mat-icon class="material-icons-round"> download </mat-icon>
        </button>
        <button mat-icon-button class="hs-icon-button-32" [matMenuTriggerFor]="menu">
          <mat-icon class="material-icons-round color-red-5"> delete </mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="container().removeItem($event, gridsterWidgets())">
            确认删除
          </button>
        </mat-menu>
      </div>
    </div>
  </div>`,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
})
export class EditWidgetActionsTooltipComponent implements AfterViewInit {
  container = input.required<DashboardWidgetDesignComponent>();
  @Output() viewInited = new EventEmitter();

  gridsterWidgets = computed(() => this.container().gridsterWidgets());
  gridsterItem = computed(() => this.container().gridsterItem());

  constructor(
    public element: ElementRef<HTMLElement>,
    public cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    this.viewInited.emit();
  }
}
