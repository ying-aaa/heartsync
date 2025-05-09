import { Component, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetFolderComponent } from '../widget/widget-folder.component';
import { DashboardViewportComponent } from './dashboard-viewport.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { DashboardToolbarComponent } from './toolbar/dashboard-toolbar.component';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';
import { getParamFromRoute } from '@src/app/core/utils';
import { DashboardService } from '@src/app/core/http/dashboard.service';
import { firstValueFrom } from 'rxjs';

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
  businessKey = 'dashboard';
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
      const { id } = node;
      let next = false;
      try {
        const res = await firstValueFrom(
          this.dashboardService.removeDashboard(id),
        );
        if (res.statusCode === 200) next = true;
      } catch (error) {
        next = false;
      }
      return next;
    },
    selectEvent: (node, jsTree) => {
      if (node) {
        this.fileId = node.id;
      }
    },
    renameNodeSuccess: (node, jsTree) => {
      console.log('%c Line:57 🧀 node, jsTree', 'color:#42b983', node, jsTree);
    },
    createNodeSuccess: (node, jsTree) => {
      const { id: nodeId, text: name } = node;

      this.dashboardService
        .createDashboard({
          nodeId,
          name,
          appId: this.appId!,
          type: 'gridster',
        })
        .subscribe({
          next: () => {},
        });
      console.log('%c Line:57 🧀 node, jsTree', 'color:#42b983', node, jsTree);
    },
    copyPasteNodeSuccess: (node, jsTree) => {
      console.log('%c Line:57 🧀 node, jsTree', 'color:#42b983', node, jsTree);
    },
    deleteNodeSuccess: async (node, jsTree) => {
      console.log('%c Line:57 🧀 node, jsTree', 'color:#42b983', node, jsTree);
    },
  });

  constructor(
    private widgetEditorService: WidgetEditorService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
  ) {}

  get widgetConfig() {
    return this.widgetEditorService.currentWidgetConfig();
  }

  ngOnInit() {}
}
