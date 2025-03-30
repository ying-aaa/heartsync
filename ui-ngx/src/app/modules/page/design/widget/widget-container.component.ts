import { Component, input, OnInit } from '@angular/core';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetFormComponent } from '@src/app/modules/components/widget-form/widget-form.component';
import { IWidgetSizeStyle } from '@src/app/shared/models/public-api';

@Component({
  selector: 'hs-widget-container',
  templateUrl: './widget-container.component.html',
  styleUrls: ['./widget-container.component.less'],
  imports: [WidgetFormComponent],
})
export class WidgetContainerComponent implements OnInit {
  workSizeConfigStyle = input.required<IWidgetSizeStyle>();

  constructor(private widgetEditorService: WidgetEditorService) {}

  ngOnInit() {}

  get widgetId() {
    return this.widgetEditorService.currentWidgetId;
  }
}
