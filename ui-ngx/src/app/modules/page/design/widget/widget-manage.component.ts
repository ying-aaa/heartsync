import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetFolderComponent } from './widget-folder.component';
import { FormlyConfigComponent } from '@src/app/modules/components/formly-config/formly-config.component';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetViewportComponent } from './widget-viewport.component';

@Component({
  selector: 'hs-widget-manage',
  templateUrl: './widget-manage.component.html',
  imports: [
    WidgetFolderComponent,
    MatDividerModule,
    WidgetViewportComponent,
    FormlyConfigComponent,
  ],
})
export class WidgetManageComponent implements OnInit {
  constructor(private widgetEditorService: WidgetEditorService) {}

  get widgetConfig() {
    return this.widgetEditorService.currentWidgetConfig();
  }

  ngOnInit() {}
}
