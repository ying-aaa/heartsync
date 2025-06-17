import { Injectable, signal } from '@angular/core';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';
import { MenuHttpService } from '../http/menu.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RunAppMenuService {
  menuData = signal<IMenuNode[]>([]);

  constructor(private menuHttpService: MenuHttpService) {}

  loadMenuData(appId: string): Observable<IMenuNode[]> {
    return this.menuHttpService.getMenusByAppId(appId).pipe(
      tap((res: IMenuNode[]) => {
        this.menuData.set(res);
      })
    );
  }
}
