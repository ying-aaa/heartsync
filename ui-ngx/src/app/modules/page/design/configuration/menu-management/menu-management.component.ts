import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { IMenuNode, IMenuType } from '@shared/models/app-menu.model';
import { HsInlineEditorModule } from '@shared/components/hs-inline-editor/inline-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { MatChipsModule } from '@angular/material/chips';

interface FlatIMenuNode extends IMenuNode {
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
    MatChipsModule,
  ],
})
export class MenuManagementComponent {
  IMenuType = IMenuType;
  displayedColumns: string[] = [
    'menuType',
    'name',
    'dashboardId',
    'isFullscreen',
    'actions',
  ];

  clickedRows: IMenuNode | null = null;

  // 使用信号管理树数据
  treeData = signal<IMenuNode[]>([]);

  // 节点展开状态管理（独立信号）
  expandedNodes = signal<Set<string>>(new Set());

  // 扁平节点计算（仅计算需要渲染的节点）
  flattenedNodes = computed(() => {
    const result: FlatIMenuNode[] = [];
    const expandedSet = this.expandedNodes();

    const processNode = (node: IMenuNode, level: number) => {
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
  // getChildren(parent: FlatIMenuNode): FlatIMenuNode[] {
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
  private findNode(id: string, nodes?: IMenuNode[]): IMenuNode | null {
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

  addChildNode(type: IMenuType, node: any) {
    const newNode: IMenuNode = {
      id: Math.random().toString(36).substring(2, 15), // 生成随机 ID
      name: `新${type === IMenuType.Parent ? '目录' : '菜单'}`,
      icon: 'system-icon',
      menuType: type,
      parentMenuId: node.id,
      isFullscreen: false,
      sortOrder: 1,
      dashboardId: null,
      children: [],
    };

    if (node.children) {
      node.children.push(newNode);
    } else {
      node.children = [newNode];
    }

    this.treeData.update((currentData) => [...currentData]);

    // 触发展开状态更新
    this.expandedNodes.update((expanded) => {
      const newSet = new Set(expanded);
      newSet.add(node.id);
      return newSet;
    });
  }

  addSameNode(type: IMenuType, node: any) {
    const newNode: IMenuNode = {
      id: Math.random().toString(36).substring(2, 15), // 生成随机 ID
      name: `新${type === IMenuType.Parent ? '目录' : '菜单'}`,
      icon: 'system-icon',
      menuType: type,
      parentMenuId: node && node.parentMenuId,
      isFullscreen: false,
      sortOrder: 1,
      dashboardId: null,
      children: [],
    };

    const parentNode = this.findNode(node?.parentMenuId);

    if (parentNode) {
      if (parentNode.children) {
        parentNode.children.push(newNode);
      } else {
        parentNode.children = [newNode];
      }
      return this.treeData.update((currentData) => [...currentData]);
    } else {
      return this.treeData.update((currentData) => [...currentData, newNode]);
    }
  }

  deleteNode(node: IMenuNode) {
    const removeNodeRecursively = (
      nodes: IMenuNode[],
      id: string,
    ): IMenuNode[] => {
      return nodes
        .map((n) => {
          if (n.id === id) {
            return null; // 标记为删除
          }
          if (n.children) {
            n.children = removeNodeRecursively(n.children, id);
          }
          return n;
        })
        .filter((n) => n !== null);
    };

    this.treeData.update((currentData) =>
      removeNodeRecursively(currentData, node.id),
    );
    this.expandedNodes.update((expanded) => {
      const newSet = new Set(expanded);
      newSet.delete(node.id);
      return newSet;
    });
  }

  // 切换节点展开状态
  toggleNode(node: FlatIMenuNode) {
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

  rowClicked(row: IMenuNode) {
    // if (this.clickedRows === row) {
    //   this.clickedRows = null; // 取消选中
    // } else {
    this.clickedRows = row; // 选中当前行
    // }
  }

  customContextMenu = {
    createFile: {
      label: '添加菜单',
      icon: 'file',
      action: (data: any) => {
        this.addChildNode(IMenuType.Child, data);
      },
    },
    createFolder: {
      label: '添加目录',
      icon: 'folder-close',
      divider: true,
      action: (data: any) => {
        this.addChildNode(IMenuType.Parent, data);
      },
    },
  };

  get contextMenu() {
    return Object.values(this.customContextMenu);
  }

  constructor() {}

  editConfirm(value: any) {
    console.log('%c Line:34 🍬 value', 'color:#ea7e5c', value);
  }
}
