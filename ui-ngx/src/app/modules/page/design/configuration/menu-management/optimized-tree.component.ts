import { Component, signal, computed, effect } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface TreeNode {
  id: string;
  name: string;
  icon: string;
  children?: TreeNode[];
}

interface FlatTreeNode extends TreeNode {
  level: number;
  expandable: boolean;
  isExpanded: boolean;
}

@Component({
  selector: 'app-optimized-tree',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatIconModule, MatButtonModule],
  template: `
    <div class="tree-container">
      @for (node of flattenedNodes(); track node.id) {
        <div
          class="node-item"
          [style.padding-left.px]="node.level * 24"
        >
          @if (node.expandable) {
            <button
              mat-icon-button
              (click)="toggleNode(node)"
            >
              <mat-icon>
                {{ node.isExpanded ? 'expand_more' : 'chevron_right' }}
              </mat-icon>
            </button>
          } @else {
            <div style="width: 40px;"></div>
          }

          <div class="node-content">
            <mat-icon class="node-icon">{{ node.icon }}</mat-icon>
            <span>{{ node.name }}</span>
            <span class="node-id">ID: {{ node.id }}</span>
          </div>
        </div>

        <!-- @if (node.expandable && node.isExpanded) {
          <div>
            <ng-container
              *ngTemplateOutlet="childNodes; context: { $implicit: node }"
            ></ng-container>
          </div>
        } -->
      }
    </div>

    <!-- <ng-template
      #childNodes
      let-parent
    >
      @for (child of getChildren(parent); track child.id) {
        <div
          class="node-item"
          [style.padding-left.px]="child.level * 24"
        >
          @if (child.expandable) {
            <button
              mat-icon-button
              (click)="toggleNode(child)"
            >
              <mat-icon>
                {{ child.isExpanded ? 'expand_more' : 'chevron_right' }}
              </mat-icon>
            </button>
          } @else {
            <div style="width: 40px;"></div>
          }

          <div class="node-content">
            <mat-icon class="node-icon">{{ child.icon }}</mat-icon>
            <span>{{ child.name }}</span>
            <span class="node-id">ID: {{ child.id }}</span>
          </div>
        </div>

        @if (child.expandable && child.isExpanded) {
          <div>
            <ng-container
              *ngTemplateOutlet="childNodes; context: { $implicit: child }"
            ></ng-container>
          </div>
        }
      }
    </ng-template> -->

    <div class="add-node-section">
      <button
        mat-raised-button
        color="primary"
        (click)="addNode()"
      >
        <mat-icon>add</mat-icon> Add Node
      </button>
    </div>
  `,

  styles: [
    `
      .tree-container {
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 16px;
        margin: 20px 0;
      }

      .node-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f5f5f5;
      }

      .node-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .node-icon {
        color: #5c6bc0;
      }

      .node-id {
        margin-left: auto;
        font-size: 0.8rem;
        color: #757575;
      }

      .add-node-section {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class OptimizedTreeComponent {
  // 使用信号管理树数据
  treeData = signal<TreeNode[]>([
    {
      id: '1',
      name: 'Dashboard',
      icon: 'dashboard',
      children: [
        {
          id: '2',
          name: 'Default Dashboard',
          icon: 'space_dashboard',
          children: [
            {
              id: '2',
              name: 'Default Dashboard',
              icon: 'space_dashboard',
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: '3',
      name: 'Settings',
      icon: 'settings',
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

  // 添加新节点（优化更新）
  addNode() {
    this.treeData.update((data) => {
      // 在第一个节点的子节点添加新节点
      const newData = [...data];
      if (newData[0].children) {
        const newChild: TreeNode = {
          id: `node_${Date.now()}`,
          name: `New Node ${newData[0].children.length + 1}`,
          icon: 'note_add',
          children: [],
        };

        // 创建新的子数组（而不是push）
        newData[0].children = [...newData[0].children, newChild];
      }
      return newData;
    });

    // 自动展开父节点
    const parentId = this.treeData()[0].id;
    if (!this.expandedNodes().has(parentId)) {
      this.expandedNodes.update((expanded) => {
        const newSet = new Set(expanded);
        newSet.add(parentId);
        return newSet;
      });
    }
  }
}
