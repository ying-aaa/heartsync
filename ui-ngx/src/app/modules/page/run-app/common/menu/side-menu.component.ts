import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { MenuLinkComponent } from './menu-link.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MenuToggleComponent } from './menu-toggle.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { BaseDesignComponent } from '../base-design.component';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';

@Component({
  selector: 'hs-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less'],
  standalone: true,
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MenuLinkComponent,
    MenuToggleComponent,
    NgScrollbarModule,
    HsLoadingModule,
  ],
  host: {
    class: 'hs-menu-container wh-full block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent extends BaseDesignComponent implements OnInit {
  menuData = input<IMenuNode[]>([]);
  loadingStatus = signal<boolean>(false);

  treeControl = new NestedTreeControl<IMenuNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<IMenuNode>();

  protected configTypeKey = 'menuGlobal';

  constructor(override runAppDesignService: RunAppDesignService) {
    super(runAppDesignService);

    // 监听菜单数据变化
    effect(
      () => {
        const data = this.menuData();
        if (data) {
          this.dataSource.data = data;
          this.expandActiveNodePath();
        }
      },
      { allowSignalWrites: true },
    );
  }

  // 检查节点是否有子节点
  hasChild = (_: number, node: IMenuNode) => !!node.children && node.children.length > 0;

  ngOnInit() {}

  // 递归查找节点路径
  private findNodePath(
    nodes: IMenuNode[],
    targetId: string,
    currentPath: IMenuNode[] = [],
  ): IMenuNode[] | null {
    for (const node of nodes) {
      const newPath = [...currentPath, node];

      if (node.id === targetId) {
        return newPath;
      }

      if (node.children) {
        const foundPath = this.findNodePath(node.children, targetId, newPath);
        if (foundPath) return foundPath;
      }
    }
    return null;
  }

  // 展开活动节点路径
  private expandActiveNodePath() {
    const activeId = sessionStorage.getItem('selectedMenuId');
    if (!activeId || !this.dataSource.data) return;

    const path = this.findNodePath(this.dataSource.data, activeId);
    if (path) {
      // 展开路径中所有父节点
      path.slice(0, -1).forEach((node) => {
        this.treeControl.expand(node);
      });
    }
  }
}
