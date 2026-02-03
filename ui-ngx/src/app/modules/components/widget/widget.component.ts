import { Component, computed, input } from '@angular/core';
import { WidgetCesiumComponent } from '@src/app/modules/components/widget-cesium/widget-cesium.component';
import { WidgetChartComponent } from '@src/app/modules/components/widget-chart/widget-chart.component';
import { WidgetCodeComponent } from '@src/app/modules/components/widget-code/widget-code.component';
import { WidgetDetailComponent } from '@src/app/modules/components/widget-detail/widget-detail.component';
import { WidgetFormComponent } from '@src/app/modules/components/widget-form/widget-form.component';
import { WidgetListComponent } from '@src/app/modules/components/widget-list/widget-list.component';
import { IWidgetType } from '@src/app/shared/models/public-api';
import { CommonModule } from '@angular/common';
import { IFormWidgetConfig, IWidgetTypesConfig } from '@heartsync/types';

@Component({
  selector: 'hs-widget',
  templateUrl: './widget.component.html',
  imports: [
    CommonModule,
    WidgetCodeComponent,
    WidgetChartComponent,
    WidgetCesiumComponent,
    WidgetFormComponent,
    WidgetListComponent,
    WidgetDetailComponent,
  ],
})
export class WidgetComponent {
  widgetConfig = input.required<IWidgetTypesConfig | undefined>();

  IWidgetType = IWidgetType;

  formWidgetConfig = computed(() => {
    return this.widgetConfig() as IFormWidgetConfig;
  });
}
