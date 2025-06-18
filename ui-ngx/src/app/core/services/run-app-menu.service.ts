import { Injectable, signal } from '@angular/core';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { MenuHttpService } from '../http/menu.service';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RunAppMenuService {
  menuData = signal<IMenuNode[]>([]);

  constructor(
    private router: Router,
    private menuHttpService: MenuHttpService,    
  ) {}

  loadMenuData(appId: string): Observable<IMenuNode[]> {
    return this.menuHttpService.getMenusByAppId(appId).pipe(
      tap((res: IMenuNode[]) => {
        this.menuData.set(res);
      })
    );
  }

  navigateToDefaultDashboard(appId: string, menuData: IMenuNode[]): void {
    const selectedMenuId = sessionStorage.getItem('selectedMenuId');
    if(selectedMenuId) return;
    const dashboardId = findDashboardId(menuData);
    if (dashboardId) {
      sessionStorage.setItem('selectedMenuId', dashboardId);
      const url = `/run-app/${appId}/dashboard/${dashboardId}`;
      this.router.navigate([url]);
    } else {
      console.error('未找到 type 为 dashboard 的节点');
    }
  }
}


// 递归查找第一个 type 为 'dashboard' 的节点的 id
function findDashboardId(menuData: IMenuNode[]): string | null {
  for (const item of menuData) {
    if (item.menuType === 'dashboard') {
      return item.id;
    } else if (item.children && item.children.length > 0) {
      const foundId = findDashboardId(item.children); // 递归查找子节点
      if (foundId) {
        return foundId; 
      }
    }
  }
  return null; 
}