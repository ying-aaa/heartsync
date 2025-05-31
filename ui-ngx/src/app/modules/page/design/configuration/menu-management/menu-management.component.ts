import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { IMenuNode, IMenuType } from '@shared/models/app-menu.model';
import { HsInlineEditorModule } from '@shared/components/hs-inline-editor/inline-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface ExampleFlatNode extends IMenuNode {
  expandable: boolean;
  level: number;
}

@Component({
  selector: 'hs-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.less'],
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    HsInlineEditorModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MenuManagementComponent {
  displayedColumns: string[] = ['menuType', 'icon', 'name', 'dashboardId'];
  title = true;
  private _transformer = (node: IMenuNode, level: number) => {
    return {
      ...node,
      expandable: !!node.children && node.children.length > 0,
      level: level,
    };
  };

  // treeControl = new NestedTreeControl<DepartmentNode>(node => node.children);
  // dataSource = new MatTreeNestedDataSource<DepartmentNode>();

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = [
      {
        id: '1',
        name: '系统管理',
        icon: 'system-icon',
        menuType: IMenuType.Parent,
        parentMenuId: null,
        isFullscreen: false,
        sortOrder: 1,
        dashboardId: null,
        children: [
          {
            id: '11',
            name: '用户管理',
            icon: 'user-icon',
            menuType: IMenuType.Child,
            parentMenuId: '1',
            isFullscreen: false,
            sortOrder: 1,
            dashboardId: 'dashboard-1',
          },
          {
            id: '12',
            name: '角色管理',
            icon: 'role-icon',
            menuType: IMenuType.Child,
            parentMenuId: '1',
            isFullscreen: false,
            sortOrder: 2,
            dashboardId: 'dashboard-2',
          },
        ],
      },
      {
        id: '2',
        name: '数据监控',
        icon: 'data-icon',
        menuType: IMenuType.Parent,
        parentMenuId: null,
        isFullscreen: false,
        sortOrder: 2,
        dashboardId: null,
        children: [
          {
            id: '21',
            name: '流量监控',
            icon: 'traffic-icon',
            menuType: IMenuType.UrlRedirect,
            parentMenuId: '2',
            isFullscreen: false,
            url: '/monitor/traffic',
            sortOrder: 1,
            dashboardId: 'dashboard-3',
          },
          {
            id: '22',
            name: '性能监控',
            icon: 'performance-icon',
            menuType: IMenuType.UrlRedirect,
            parentMenuId: '2',
            isFullscreen: false,
            url: '/monitor/performance',
            sortOrder: 2,
            dashboardId: 'dashboard-4',
          },
        ],
      },
      {
        id: '3',
        name: '应用中心',
        icon: 'app-icon',
        menuType: IMenuType.Parent,
        parentMenuId: null,
        isFullscreen: true,
        sortOrder: 3,
        dashboardId: null,
        children: [
          {
            id: '31',
            name: '报表应用',
            icon: 'report-icon',
            menuType: IMenuType.AppRedirect,
            parentMenuId: '3',
            isFullscreen: true,
            appId: 'app-1',
            sortOrder: 1,
            dashboardId: 'dashboard-5',
          },
          {
            id: '32',
            name: '工具应用',
            icon: 'tool-icon',
            menuType: IMenuType.AppRedirect,
            parentMenuId: '3',
            isFullscreen: true,
            appId: 'app-2',
            sortOrder: 2,
            dashboardId: 'dashboard-6',
          },
        ],
      },
    ];
  }
  editConfirm(value: any) {
    console.log('%c Line:34 🍬 value', 'color:#ea7e5c', value);
  }
  toggleRow(node: ExampleFlatNode) {
    this.treeControl.toggle(node);
  }
}
