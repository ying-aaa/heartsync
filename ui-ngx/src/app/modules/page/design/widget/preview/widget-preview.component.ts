import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { IWidgetType } from '@src/app/shared/models/public-api';
import { MatDividerModule } from '@angular/material/divider';
import { FormPreviewComponent } from "./form-preview.componetn";
@Component({
  selector: 'hs-widget-preview',
  templateUrl: './widget-preview.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormPreviewComponent
],
  host: {
    class: 'block relative',
  },
})
export class WidgetPreviewComponent implements OnInit {
  widgetId = signal<string>('');

  widgetType = signal<IWidgetType>("" as IWidgetType);

  IWidgetType = IWidgetType;

  constructor(
    private route: ActivatedRoute,
  ) {}


  initRouteWidget() {
    const widgetId = this.route.snapshot.queryParams['widgetId'];
    const widgetType = this.route.snapshot.queryParams['widgetType'];
    this.widgetId.set(widgetId);
    this.widgetType.set(widgetType);
  }

  ngOnInit() {
    this.initRouteWidget();
  }
}
