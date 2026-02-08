import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { GridsterItemComponentInterface } from 'angular-gridster2';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { WidgetContainerComponent } from '@src/app/modules/components/widget-container/widget-container.component';
import { DashboardConfigService } from '@src/app/core/services/dashboard-config.service';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { IWidgetTypesConfig } from '@heartsync/types';

@Component({
  selector: 'hs-dashboard-widget-design',
  templateUrl: './dashboard-widget-design.component.html',
  imports: [
    MatIcon,
    MatMenuModule,
    MatIconModule,
    OverlayModule,
    MatButtonModule,
    WidgetContainerComponent,
  ],
})
export class DashboardWidgetDesignComponent implements OnInit, OnDestroy {
  gridsterItem = input.required<GridsterItemComponentInterface>();
  gridsterWidgets = input.required<any>();
  widget = input.required<IWidgetTypesConfig>();
  isRuntime = input.required<boolean>();
  isDragging = input.required<boolean>();

  selectWidgetId = computed(() => this.dashboardEditorService.currentSelectWidgetId());
  // 当前选中的widgetId
  isActive = signal<boolean>(false);
  isHover = signal<boolean>(false);

  @ViewChild('toolbarContainer') toolbarContainer!: ElementRef<HTMLElement>;
  @ViewChild('trigger') triggerRef!: ElementRef<HTMLElement>;

  constructor(
    private dashboardEditorService: DashboardEditorService,
    private dashboardConfigService: DashboardConfigService,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    effect(() => {
      const selectWidgetId = this.selectWidgetId();
      this.isActive.set(selectWidgetId === this.gridsterWidgets().id);
    });
  }

  handleTriggerMouseOver() {
    const currentWidgetId = this.gridsterWidgets().widgetId;
    this.isHover.set(true);

    this.closeOtherWidgetsHover(currentWidgetId);
  }

  handleTriggerMouseOut() {
    this.isHover.set(false);
  }

  private closeOtherWidgetsHover(currentWidgetId: string) {
    const allWidgetElements = document.querySelectorAll('hs-dashboard-widget-design');

    allWidgetElements.forEach((element) => {
      if (element === this.elementRef.nativeElement) return;

      const widgetComponent = (element as any).componentInstance;
      if (widgetComponent && widgetComponent.widget().widgetId !== currentWidgetId) {
        widgetComponent.isHover.set(false);
      }
    });
  }

  removeItem($event: MouseEvent | TouchEvent, widget: any): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboardConfigService.removeWidget(widget);
  }

  ngOnDestroy(): void {
    this.isHover.set(false);
  }

  ngOnInit() {}
}
