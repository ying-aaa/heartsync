import { Injectable, signal } from '@angular/core';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { MenuHttpService } from '../http/menu.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApplicationService, IAppConfig } from '@core/http/application.service';

@Injectable({
  providedIn: 'root',
})
export class RunAppMenuService {
  appConfig = signal<IAppConfig>({} as IAppConfig);
  menuData = signal<IMenuNode[]>([]);

  constructor(
    private router: Router,
    private menuHttpService: MenuHttpService,
    private applicationService: ApplicationService,
  ) {}

  // loadAppConfig(appId: string) {
  //   return this.applicationService.findApplicationById(appId).pipe(
  //     tap((res: IAppConfig) => {
  //       this.appConfig.set(res);
  //     }),
  //   );
  // }

  loadMenuData(appId: string): Observable<IMenuNode[]> {
    return this.menuHttpService.getMenusByAppId(appId).pipe(
      tap((res: IMenuNode[]) => {
        this.menuData.set(res);
      }),
    );
  }

  loadAppAndMenu(appId: string): Observable<[IAppConfig, IMenuNode[]]> {
    return forkJoin([
      this.applicationService.findApplicationById(appId),
      this.menuHttpService.getMenusByAppId(appId),
    ]).pipe(
      tap(([config, menus]) => {
        this.appConfig.set(config); // 写入信号/状态
        this.menuData.set(menus);
      }),
    );
  }

  navigateToDefaultDashboard(appId: string, menuData: IMenuNode[]): void {
    const selectedMenuId = sessionStorage.getItem('selectedMenuId');
    if (selectedMenuId) return;
    const dashboardId = findDashboardId(menuData);
    if (dashboardId) {
      sessionStorage.setItem('selectedMenuId', dashboardId);
      const url = `/run-app/${appId}/dashboard/${dashboardId}`;
      this.router.navigate([url]);
    } else {
      console.error('未找到 type 为 dashboard 的节点');
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
function findDashboardId(menuData: IMenuNode[]): string | null {
  for (const item of menuData) {
    if (item.menuType === 'dashboard') {
      return item.dashboardId;
    } else if (item.children && item.children.length > 0) {
      const foundId = findDashboardId(item.children); // 递归查找子节点
      if (foundId) {
        return foundId;
      }
    }
  }
  return null;
}
