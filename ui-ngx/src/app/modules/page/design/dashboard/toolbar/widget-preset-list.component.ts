import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatChipSelectionChange,
  MatChipsModule,
} from '@angular/material/chips';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';
import { widgetTypesList } from '@src/app/core/services/widget-editor.service';
import { IWidgetType } from '@src/app/shared/models/widget.model';

@Component({
  selector: 'hs-widget-preset-list',
  templateUrl: './widget-preset-list.component.html',
  imports: [MatChipsModule],
})
export class WidgetPresetListComponent implements OnInit {
  widgetTypesList = widgetTypesList;
  widgetType = IWidgetType;

  constructor(private dashboardEditorService: DashboardEditorService) {}

  get currentWidgetType() {
    return this.dashboardEditorService.currentWidgetType();
  }

  onSelectionChange(event: MatChipSelectionChange) {
    if (!event.selected) {
      event.selected = true;
    }
    this.dashboardEditorService.updateWidgetType(event.source.value);
  }

  ngOnInit() {}
}
