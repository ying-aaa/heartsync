import { Component, computed, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { IMenuNode, IMenuType } from '@shared/models/app-menu.model';
import { HsInlineEditorModule } from '@shared/components/hs-inline-editor/inline-editor.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CdkContextMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { generateUUID, getParamFromRoute } from '@src/app/core/utils';
import { MenuHttpService } from '@src/app/core/http/menu.service';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { MatMenuModule } from '@angular/material/menu';
import { TreeSelectComponent } from '@src/app/shared/components/hs-tree-select/hs-tree-select.component';
import { FileTreeService } from '@src/app/core/http/file-tree.service';
import { delay } from 'rxjs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    MatInputModule,
    HsLoadingModule,
    MatTooltipModule,
    MatMenuModule,
    TreeSelectComponent,
    NgScrollbarModule,
    MatSelectModule,
    MatFormFieldModule
  ],
})
export class MenuManagementComponent implements OnInit {

  IMenuType = IMenuType;
  appId: string = getParamFromRoute('appId', this.route)!;

  searchControl = new FormControl('');

  loadingStatus = false;

  displayedColumns: string[] = [
    'name',
    'menuType',
    'dashboardId',
    'isFullscreen',
    'actions',
  ];

  clickedRows: IMenuNode | null = null;

  // 使用信号管理树数据
  treeData = signal<IMenuNode[]>([]);

  dashboardData = signal<IMenuNode[]>([]);

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

  constructor(
    private route: ActivatedRoute,
    private menuHttpService: MenuHttpService,
    private fileTreeService: FileTreeService
  ) {
    this.initMenuFilter();
  }

  // 根据nodeId查找节点并更新节点值
  changeNodeValue(nodeId: string, field: keyof IMenuNode, value: any) {
    let isChanged = false;
    let matchedNode: IMenuNode | undefined;
    const updateNodeValue = (nodes: IMenuNode[]): IMenuNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          isChanged = node[field] !== value;
          matchedNode = node;
          return { ...node, [field]: value };
        }
        if (node.children) {
          return { ...node, children: updateNodeValue(node.children) };
        }
        return node;
      });
    };
    this.treeData.update((currentData) => updateNodeValue(currentData));

    if (isChanged && matchedNode) {
      const updateData = { id: matchedNode.id, [field]: value } as IMenuNode;
      this.menuHttpService
        .updateMenu(matchedNode.id, updateData)
        .subscribe((res) => {});
    }
  }

  initMenuFilter() {}

  collapseAll() {
    this.expandedNodes.set(new Set());
  }

  expandAll() {
    const allNodeIds = new Set<string>();
    const collectNodeIds = (nodes: IMenuNode[]) => {
      nodes.forEach((node) => {
        allNodeIds.add(node.id);
        if (node.children) {
          collectNodeIds(node.children);
        }
      });
    };
    collectNodeIds(this.treeData());
    this.expandedNodes.set(allNodeIds);
  }

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
      id: generateUUID(),
      appId: this.appId!,
      name: `新${type === IMenuType.Parent ? '目录' : '菜单'}`,
      icon: 'system-icon',
      menuType: type,
      parentMenuId: node.id,
      isFullscreen: false,
      sort: 1,
      dashboardId: null,
    };

    const nodeOriginData = this.findNode(node.id)!;

    if (nodeOriginData.children) {
      nodeOriginData.children.push(newNode);
    } else {
      nodeOriginData.children = [newNode];
    }

    this.treeData.update((currentData) => [...currentData]);

    // 触发展开状态更新
    this.expandedNodes.update((expanded) => {
      const newSet = new Set(expanded);
      newSet.add(node.id);
      return newSet;
    });

    this.menuHttpService.createMenu(newNode).subscribe((res) => {});
  }

  addSameNode(type: IMenuType, node: any) {
    const newNode: IMenuNode = {
      id: generateUUID(),
      appId: this.appId!,
      name: `新${type === IMenuType.Parent ? '目录' : '菜单'}`,
      icon: 'system-icon',
      menuType: type,
      parentMenuId: node && node.parentMenuId,
      isFullscreen: false,
      sort: 1,
      dashboardId: null,
    };

    const parentNode = this.findNode(node?.parentMenuId);

    if (parentNode) {
      if (parentNode.children) {
        parentNode.children.push(newNode);
      } else {
        parentNode.children = [newNode];
      }
      this.treeData.update((currentData) => [...currentData]);
    } else {
      this.treeData.update((currentData) => [...currentData, newNode]);
    }

    this.menuHttpService.createMenu(newNode).subscribe((res) => {});
  }

  deleteMenu(node: IMenuNode) {
    if (node.id === this.clickedRows?.id) this.clickedRows = null;

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

    this.menuHttpService.deleteMenu(node.id).subscribe((res) => {});
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
        this.addChildNode(IMenuType.Dashboard, data);
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

  loadMenuData() {
    this.loadingStatus = true;
    // 清空对应数据
    this.menuHttpService.getMenusByAppId(this.appId).subscribe(
      (res: IMenuNode[]) => {
        this.expandedNodes.set(new Set());
        this.treeData.set(res);
        this.loadingStatus = false;
        this.expandAll();
      },
      (error) => {
        this.loadingStatus = false;
      },
    );
  }

  loadDashboardData() {
    this.fileTreeService
    .getEntireTree(this.appId, "dashboard")
    .pipe(delay(0))
    .subscribe({
      next: async (responseData) => {
        this.dashboardData.set(responseData);
        console.log("%c Line:353 🍷 responseData", "color:#42b983", responseData);
      },
      error() {
      },
    });
  }

  ngOnInit(): void {
    this.loadMenuData();
    this.loadDashboardData();
  }
}
