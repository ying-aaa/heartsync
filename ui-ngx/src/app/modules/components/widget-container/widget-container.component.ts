import { Component, Input, input, OnInit, signal } from '@angular/core';
import { WidgetService } from '@src/app/core/http/widget.service';
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
import { HsLoadingComponent } from "@src/app/shared/components/hs-loading/hs-loading.component";

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
    HsLoadingComponent
],
})
export class WidgetContainerComponent implements OnInit {
  workSizeConfigStyle = input<any>({} as IWidgetSizeStyle);

  widgetId = input.required<string>();

  _widgetType: IWidgetType;

  @Input()
  get widgetType() {
    return this._widgetType;
  }
  set widgetType(value: IWidgetType) {
    this._widgetType = value;
  }

  loadingState = signal(false);

  IWidgetType = IWidgetType;
  

  constructor(private WidgetHttpService: WidgetService) {}

  ngOnInit() {
    if(this._widgetType) return;
    this.loadingState.set(true);
    this.WidgetHttpService.findOneWidget(this.widgetId()).subscribe((res) => {
      this._widgetType = res.type;
      this.loadingState.set(false);
    }, () => {
      this.loadingState.set(false);
    })
  }
}
