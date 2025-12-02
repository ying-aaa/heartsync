import { Injectable, signal } from '@angular/core';
import { MenuHttpService } from '@src/app/core/http/menu.service';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';

@Injectable({ providedIn: 'root' })
export class MenuManagementService {
  // 全局菜单配置数据
  globalMenuConfig = signal<any>({
    themeId: '2',
  });

  // 菜单数据
  menuData = signal<IMenuNode[]>([]);

  // 仪表板数据
  dashboardData = signal<any>([]);

  constructor(private menuHttpService: MenuHttpService) {}

  
}
