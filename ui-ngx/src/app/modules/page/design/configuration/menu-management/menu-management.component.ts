import { Component, computed, signal } from '@angular/core';
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
import { MatDividerModule } from '@angular/material/divider';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { OptimizedTreeComponent } from './optimized-tree.component';

interface ExampleFlatNode extends IMenuNode {
  expandable: boolean;
  level: number;
}

interface TreeNode extends IMenuNode {}

interface FlatTreeNode extends TreeNode {
  level: number;
  expandable: boolean;
  isExpanded: boolean;
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
    MatDividerModule,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    HsSvgModule,
    OptimizedTreeComponent,
  ],
})
export class MenuManagementComponent {
  displayedColumns: string[] = [
    'menuType',
    'name',
    'dashboardId',
    'isFullscreen',
    'actions',
  ];
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

  // 使用信号管理树数据
  treeData = signal<TreeNode[]>([
    {
      id: '1',
      name: '系统管理0',
      icon: 'system-icon',
      menuType: IMenuType.Parent,
      parentMenuId: null,
      isFullscreen: false,
      sortOrder: 1,
      dashboardId: null,
      children: [
        {
          id: '2',
          name: '系统管理1',
          icon: 'system-icon',
          menuType: IMenuType.Child,
          parentMenuId: null,
          isFullscreen: false,
          sortOrder: 1,
          dashboardId: null,
          children: [],
        },
      ],
    },
    {
      id: '2',
      name: '系统管理2',
      icon: 'system-icon',
      menuType: IMenuType.Child,
      parentMenuId: null,
      isFullscreen: false,
      sortOrder: 1,
      dashboardId: null,
      children: [],
    },
  ]);

  // 节点展开状态管理（独立信号）
  expandedNodes = signal<Set<string>>(new Set());

  // 扁平节点计算（仅计算需要渲染的节点）
  flattenedNodes = computed(() => {
    const result: FlatTreeNode[] = [];
    const expandedSet = this.expandedNodes();

    const processNode = (node: TreeNode, level: number) => {
      const isExpanded = expandedSet.has(node.id);
      const expandable = !!(node.children && node.children.length > 0);

      result.push({
        ...node,
        level,
        expandable,
        isExpanded,
      });

      if (isExpanded && expandable && node.children) {
        node.children.forEach((child) => processNode(child, level + 1));
      }
    };

    this.treeData().forEach((node) => processNode(node, 0));
    return result;
  });

  trackById(index: number, item: any): number {
    return index;
  }

  // 获取子节点（优化渲染）
  // getChildren(parent: FlatTreeNode): FlatTreeNode[] {
  //   const parentNode = this.findNode(parent.id);
  //   if (!parentNode || !parentNode.children) return [];

  //   return parentNode.children.map((child) => ({
  //     ...child,
  //     level: parent.level + 1,
  //     expandable: !!(child.children && child.children.length > 0),
  //     isExpanded: this.expandedNodes().has(child.id),
  //   }));
  // }

  // 查找节点（优化性能）
  private findNode(id: string, nodes?: TreeNode[]): TreeNode | null {
    const searchNodes = nodes || this.treeData();
    for (const node of searchNodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  // 切换节点展开状态
  toggleNode(node: FlatTreeNode) {
    this.expandedNodes.update((expanded) => {
      const newSet = new Set(expanded);
      if (newSet.has(node.id)) {
        newSet.delete(node.id);
      } else {
        newSet.add(node.id);
      }
      return newSet;
    });
  }

  customContextMenu = {
    createFile: {
      label: '添加菜单',
      icon: 'file',
      action: (data: any) => {
        // const parentData = findParentMenuById(this.dataSource.data, data.id);
        // console.log('%c Line:80 🎂 parentData', 'color:#3f7cff', parentData);
        data.children.push({
          id: '3',
          name: '菜单1',
          icon: 'system-icon',
          menuType: IMenuType.Child,
          parentMenuId: null,
          isFullscreen: false,
          sortOrder: 1,
          dashboardId: null,
          children: [],
        });
      },
    },
    createFolder: {
      label: '添加目录',
      icon: 'folder-close',
      divider: true,
      action: (data: any) => {
        data.push({
          id: '4',
          name: '目录1',
          icon: 'system-icon',
          menuType: IMenuType.Child,
          parentMenuId: null,
          isFullscreen: false,
          sortOrder: 1,
          dashboardId: null,
          children: [],
        });
      },
    },
  };

  get contextMenu() {
    return Object.values(this.customContextMenu);
  }

  constructor() {}

  // 在组件中
  updateDataSource(newNode: any) {
    const newData = structuredClone(this.dataSource.data); // 或使用 lodash.cloneDeep
    newData[0].children!.push(newNode);
    this.dataSource.data = newData;
  }

  editConfirm(value: any) {
    console.log('%c Line:34 🍬 value', 'color:#ea7e5c', value);
  }
  toggleRow(node: ExampleFlatNode) {
    this.treeControl.toggle(node);
  }
}
