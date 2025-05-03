import { Component, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetFolderComponent } from '../widget/widget-folder.component';
import { DashboardViewportComponent } from './dashboard-viewport.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { DashboardToolbarComponent } from './dashboard-toolbar.component';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';
import { getParamFromRoute } from '@src/app/core/utils';

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
    HsTreeComponent,
  ],
})
export class DashboardManageComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);
  fileId: string;

  treeConfig = signal<IFileTreeConfig>({
    featureList: [
      'createFile',
      'createFolder',
      'rename',
      'remove',
      'copy',
      'cut',
      'paste',
      'dnd',
      'blank',
      'search',
    ],
    deleteEvent: async (node, jsTree) => {
      return true;
    },
    selectEvent: (node, jsTree) => {
      if (node) {
        this.fileId = node.id;
      }
    },
  });

  constructor(
    private widgetEditorService: WidgetEditorService,
    private route: ActivatedRoute,
  ) {}

  get widgetConfig() {
    return this.widgetEditorService.currentWidgetConfig();
  }

  ngOnInit() {}
}
