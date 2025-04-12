import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { FormlyConfigComponent } from '@src/app/modules/components/formly-config/formly-config.component';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetFolderComponent } from '../widget/widget-folder.component';
import { DashboardViewportComponent } from './dashboard-viewport.component';

@Component({
  selector: 'hs-dashboard-manage',
  templateUrl: './dashboard-manage.component.html',
  styleUrls: ['./dashboard-manage.component.less'],
  imports: [
    WidgetFolderComponent,
    MatDividerModule,
    DashboardViewportComponent,
    FormlyConfigComponent,
  ],
})
export class DashboardManageComponent implements OnInit {
  constructor(private widgetEditorService: WidgetEditorService) {}

  get widgetConfig() {
    return this.widgetEditorService.currentWidgetConfig();
  }

  ngOnInit() {}
}
