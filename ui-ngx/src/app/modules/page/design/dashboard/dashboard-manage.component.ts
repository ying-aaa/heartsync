import {
  Component,
  effect,
  OnInit,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { WidgetFolderComponent } from '../widget/widget-folder.component';
import { DashboardViewportComponent } from './dashboard-viewport.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { DashboardToolbarComponent } from './toolbar/dashboard-toolbar.component';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';
import { getParamFromRoute } from '@src/app/core/utils';
import { DashboardService } from '@src/app/core/http/dashboard.service';
import { firstValueFrom } from 'rxjs';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';

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
  sidenavStart = viewChild.required<MatSidenav>('sidenavStart');
  sidenavEnd = viewChild.required<MatSidenav>('sidenavEnd');

  appId: string | null = getParamFromRoute('appId', this.route);
  businessKey = 'dashboard';
  dashboardId: string;

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
      const { id, type } = node;
      if (type === 'folder') return true;
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
      const { type, id } = node || {};
      if (type === 'folder') return;
      if (id) {
        this.updateDashboardId(id);
      }
    },
    renameNodeSuccess: (node, jsTree) => {
      const { type, id, text: name } = node || {};
      if (type === 'folder') return;
      if (id) {
        this.dashboardService.updateDashboard(id, { name }).subscribe({
          next: () => {},
        });
      }
    },
    createNodeSuccess: (node, jsTree) => {
      const { id: nodeId, text: name, type } = node;
      if (type === 'folder') return;
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
    private dashboardEditorService: DashboardEditorService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      const isRuntime = this.dashboardEditorService.isRuntime();
      this.toggleSidenav(isRuntime);
    });
  }

  toggleSidenav(is: boolean) {
    this.sidenavStart().toggle(!is);
    this.sidenavEnd().toggle(!is);
  }

  // get widgetConfig() {
  //   return this.widgetEditorService.currentWidgetConfig();
  // }

  updateDashboardId(dashboardId: string) {
    this.dashboardId = dashboardId;
    this.dashboardEditorService.updateDashboardId(this.dashboardId);
  }

  ngOnInit() {}
}
