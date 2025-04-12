import { Component, input, OnInit } from '@angular/core';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetCesiumComponent } from '@src/app/modules/components/widget-cesium/widget-cesium.component';
import { WidgetChartComponent } from '@src/app/modules/components/widget-chart/widget-chart.component';
import { WidgetCodeComponent } from '@src/app/modules/components/widget-code/widget-code.component';
import { WidgetDetailComponent } from '@src/app/modules/components/widget-detail/widget-detail.component';
import { WidgetFormComponent } from '@src/app/modules/components/widget-form/widget-form.component';
import { WidgetListComponent } from '@src/app/modules/components/widget-list/widget-list.component';
import {
  IWidgetSizeStyle,
  IWidgetType,
} from '@src/app/shared/models/public-api';

@Component({
  selector: 'hs-widget-container',
  templateUrl: './widget-container.component.html',
  imports: [
    WidgetCodeComponent,
    WidgetChartComponent,
    WidgetCesiumComponent,
    WidgetFormComponent,
    WidgetListComponent,
    WidgetFormComponent,
    WidgetDetailComponent,
  ],
})
export class WidgetContainerComponent implements OnInit {
  workSizeConfigStyle = input.required<IWidgetSizeStyle>();

  widgetTypes = IWidgetType;

  constructor(private widgetEditorService: WidgetEditorService) {}

  ngOnInit() {}

  get widgetId() {
    return this.widgetEditorService.currentWidgetId;
  }

  get widgetType() {
    return this.widgetEditorService.currentWidgetType();
  }
}
