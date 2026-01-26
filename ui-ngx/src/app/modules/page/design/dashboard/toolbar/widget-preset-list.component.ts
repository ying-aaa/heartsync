import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import {
  MatChipSelectionChange,
  MatChipsModule,
} from '@angular/material/chips';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';
import {
  WidgetEditorService,
  widgetTypesList,
} from '@src/app/core/services/widget-editor.service';
import { IWidgetType } from '@src/app/shared/models/widget.model';

@Component({
  selector: 'hs-widget-preset-list',
  templateUrl: './widget-preset-list.component.html',
  imports: [MatChipsModule],
})
export class WidgetPresetListComponent implements OnInit, AfterViewInit {
  widgetTypesList = widgetTypesList;

  constructor(
    private dashboardEditorService: DashboardEditorService,
    private widgetEditorService: WidgetEditorService,
  ) {}

  get widgetType() {
    return this.dashboardEditorService.widgetType();
  }

  onSelectionChange(event: MatChipSelectionChange) {
    if (!event.selected) {
      event.selected = true;
    }
    const widgetType = event.source.value;
    this.dashboardEditorService.updateWidgetType(widgetType);
  }

  @HostListener('document:dragstart', ['$event'])
  onPresetDragStart(ev: DragEvent) {
    const traget = (ev.target as HTMLElement)!;
    const widgetId = traget.getAttribute('id');

    let widgetType;
    if (widgetId) {
      this.dashboardEditorService.updateDragstartWidgetId(widgetId);
      widgetType = this.widgetEditorService.widgetType();
    } else {
      widgetType = (ev.target as HTMLElement).getAttribute('ng-reflect-value');
    }

    this.dashboardEditorService.updateDragstartWidgetType(
      widgetType as IWidgetType,
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {}
}
