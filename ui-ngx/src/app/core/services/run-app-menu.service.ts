import { computed, Injectable, signal } from '@angular/core';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { MenuHttpService } from '../http/menu.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApplicationService, IAppConfig } from '@core/http/application.service';

@Injectable({
  providedIn: 'root',
})
export class RunAppMenuService {
  appId = signal<string | null>(null);
  appConfig = signal<IAppConfig>({} as IAppConfig);
  menuData = signal<IMenuNode[]>([]);

  selectedMenuId = signal<string | null>(null);
  selectedMenuNode = computed(() => {
    const menuData = this.menuData();
    const menuId = this.selectedMenuId();
    return menuId ? this.findNode(menuId, menuData) : null;
  });
  selectedDashboardId = computed(() => this.selectedMenuNode()?.dashboardId);

  constructor(
    private router: Router,
    private menuHttpService: MenuHttpService,
    private applicationService: ApplicationService,
  ) {}

  loadAppAndMenu(appId: string): Observable<[IAppConfig, IMenuNode[]]> {
    this.appId.set(appId);
    return forkJoin([
      this.applicationService.findApplicationById(appId),
      this.menuHttpService.getMenusByAppId(appId),
    ]).pipe(
      tap(([config, menus]) => {
        this.appConfig.set(config); // 写入信号/状态
        this.menuData.set(menus);

        this.navigateToDefaultDashboard();
      }),
    );
  }

  navigateMenuById(menuId: string): void {
    this.selectedMenuId.set(menuId);
    sessionStorage.setItem('selectedMenuId', menuId);
    const url = `/run-app/${this.appId()}/dashboard/${menuId}`;
    this.router.navigate([url]);
  }

  navigateToDefaultDashboard(menuData?: IMenuNode[]): void {
    menuData = menuData || this.menuData();
    let menuId = sessionStorage.getItem('selectedMenuId');
    if (!menuId) {
      menuId = findDefaultMenuId(menuData);
    }
    if (menuId) {
      this.navigateMenuById(menuId);
    } else {
      console.error('未找到默认菜单！');
    }
  }

  findNode(id: string, nodes?: IMenuNode[]): IMenuNode | null {
    const searchNodes = nodes || this.menuData();
    for (const node of searchNodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }
}

// 递归查找第一个 type 为 'dashboard' 的节点的 id
function findDefaultMenuId(menuData: IMenuNode[]): string | null {
  for (const item of menuData) {
    if (item.menuType !== 'parent') {
      return item.id;
    } else if (item.children && item.children.length > 0) {
      const foundId = findDefaultMenuId(item.children); // 递归查找子节点
      if (foundId) {
        return foundId;
      }
    }
  }
  return null;
}
