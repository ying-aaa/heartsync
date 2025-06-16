import { Injectable, signal } from '@angular/core';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { MenuHttpService } from '../http/menu.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menuData = signal<IMenuNode[]>([]);

  loadMenuData(appId: string): Observable<IMenuNode[]> {
    return this.menuHttpService.getMenusByAppId(appId).pipe(
      tap((res: IMenuNode[]) => {
        this.menuData.set(res);
      })
    );
  }

  constructor(private menuHttpService: MenuHttpService) {}
}
