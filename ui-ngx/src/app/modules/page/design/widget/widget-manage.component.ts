import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetFolderComponent } from './widget-folder.component';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetViewportComponent } from './widget-viewport.component';
import { FormlyConfigEditorComponent } from '@src/app/modules/components/formly-config/formly-config-editor.component';

@Component({
  selector: 'hs-widget-manage',
  templateUrl: './widget-manage.component.html',
  imports: [
    WidgetFolderComponent,
    MatDividerModule,
    WidgetViewportComponent,
    FormlyConfigEditorComponent,
  ],
})
export class WidgetManageComponent implements OnInit {
  constructor(private widgetEditorService: WidgetEditorService) {}

  currentWidgetConfig = this.widgetEditorService.currentWidgetConfig;
  options = {
    formState: {
      widgetConfig: this.currentWidgetConfig,
    },
  };

  ngOnInit() {}
}
