import { Component, effect, OnInit, signal, viewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { WidgetFolderComponent } from '../widget/widget-folder.component';
import { DashboardViewportComponent } from './dashboard-viewport.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { DashboardToolbarComponent } from './toolbar/dashboard-toolbar.component';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { ActivatedRoute } from '@angular/router';
import { IFileTreeConfig } from '@src/app/shared/components/hs-tree/tree.model';
import { getParamFromRoute, isMobile } from '@src/app/core/utils';
import { DashboardService } from '@src/app/core/http/dashboard.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { DashboardEditorService } from '@src/app/core/services/dashboard-editor.service';
import { MediaBreakpoints } from '@src/app/shared/models/constants';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { WidgetEditorService } from '@src/app/core/services/widget-editor.service';
import { IDashboardConfig, IDashboardType } from '@heartsync/types';

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
  providers: [WidgetEditorService],
})
export class DashboardManageComponent implements OnInit {
  sidenavStart = viewChild<MatSidenav>('sidenavStart');
  sidenavEnd = viewChild<MatSidenav>('sidenavEnd');

  appId: string | null = getParamFromRoute('appId', this.route);
  businessKey = 'dashboard';
  dashboardId: string;

  breakpointObserverSubscription: Subscription;

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
    disableSelectFolder: true,
    deleteEvent: async (node, jsTree) => {
      const { id, type } = node;
      if (type === 'folder') return true;
      let next = false;
      try {
        const res = await firstValueFrom(this.dashboardService.removeDashboard(id));
        if (res.statusCode === 200) next = true;
      } catch (error) {
        next = false;
      }
      return next;
    },
    selectEvent: (node, jsTree) => {
      const { type, id, text: name } = node || {};
      this.updateDashboardId(id);
      this.dashboardEditorService.updateDashboardName(name);
      this.dashboardEditorService.updateRuntimeStatus(true);
      this.sidenavEnd()?.toggle(false);
    },
    renameNodeSuccess: (node, jsTree) => {
      const { type, id, text: name } = node || {};
      if (type === 'folder') return;
      if (id) {
        this.dashboardService.updateDashboard(id, { name } as IDashboardConfig).subscribe({
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
        } as IDashboardConfig)
        .subscribe({
          next: () => {
            this.updateDashboardId(nodeId);
          },
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

  isMobile = signal(isMobile());

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private breakpointObserver: BreakpointObserver,
    private dashboardEditorService: DashboardEditorService,
  ) {
    this.breakpointObserverSubscription = this.breakpointObserver
      .observe([MediaBreakpoints['lt-sm'], MediaBreakpoints['gt-sm']])
      .subscribe((res: BreakpointState) => {
        const isMobileScreen = this.breakpointObserver.isMatched(MediaBreakpoints['lt-sm']);
        const isPcScreen = this.breakpointObserver.isMatched(MediaBreakpoints['gt-sm']);
        const isTabletScreen = !isMobileScreen && !isPcScreen;

        this.isMobile.set(isMobileScreen);

        const sidenav = this.sidenavStart && this.sidenavStart();
        if (isMobileScreen) {
          sidenav?.close();
        } else {
          sidenav?.open();
        }
      });
  }

  updateDashboardId(dashboardId: string) {
    this.dashboardId = dashboardId;
    this.dashboardEditorService.updateDashboardId(this.dashboardId);
  }

  ngOnInit() {}
}
