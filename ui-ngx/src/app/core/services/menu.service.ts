import { Injectable, signal } from '@angular/core';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { MenuHttpService } from '../http/menu.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menuData = signal<IMenuNode[]>([]);

  loadMenuData(appId: string) {
    this.menuHttpService
      .getMenusByAppId(appId)
      .subscribe((res: IMenuNode[]) => {
        this.menuData.set(res);
      });
  }

  constructor(private menuHttpService: MenuHttpService) {}
}
