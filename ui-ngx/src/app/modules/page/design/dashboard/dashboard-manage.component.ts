import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetFolderComponent } from '../widget/widget-folder.component';
import { DashboardViewportComponent } from './dashboard-viewport.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { DashboardToolbarComponent } from './dashboard-toolbar.component';

@Component({
  selector: 'hs-dashboard-manage',
  templateUrl: './dashboard-manage.component.html',
  styleUrls: ['./dashboard-manage.component.less'],
  imports: [
    MatSidenavModule,
    WidgetFolderComponent,
    MatDividerModule,
    DashboardViewportComponent,
    MatButtonModule,
    MatIconModule,
    DashboardToolbarComponent,
  ],
})
export class DashboardManageComponent implements OnInit {
  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(
    window.location.host,
  );

  constructor(private widgetEditorService: WidgetEditorService) {}

  get widgetConfig() {
    return this.widgetEditorService.currentWidgetConfig();
  }

  ngOnInit() {}
}
