import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMenuNode } from '@src/app/shared/models/app-menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuHttpService {
  private readonly apiUrl = '/api/menus'; // 根据实际API基础路径调整

  constructor(private http: HttpClient) {}

  // 创建单个菜单
  createMenu(createDto: IMenuNode): Observable<IMenuNode> {
    return this.http.post<IMenuNode>(this.apiUrl, createDto);
  }

  // 批量更新菜单
  batchUpdateMenus(batchDto: IMenuNode[]): Observable<IMenuNode[]> {
    return this.http.put<IMenuNode[]>(`${this.apiUrl}/batch`, batchDto);
  }

  // 根据应用ID获取菜单
  getMenusByAppId(appId: string): Observable<IMenuNode[]> {
    return this.http.get<IMenuNode[]>(`${this.apiUrl}/app/${appId}`);
  }

  // 获取菜单树
  getMenuTree(parentId?: string): Observable<IMenuNode[]> {
    const params = parentId
      ? new HttpParams().set('parentId', parentId)
      : undefined;
    return this.http.get<IMenuNode[]>(this.apiUrl, { params });
  }

  // 获取单个菜单详情
  getMenuById(id: string): Observable<IMenuNode> {
    return this.http.get<IMenuNode>(`${this.apiUrl}/${id}`);
  }

  // 更新菜单
  updateMenu(id: string, updateDto: Partial<IMenuNode>): Observable<IMenuNode> {
    return this.http.patch<IMenuNode>(`${this.apiUrl}/${id}`, updateDto);
  }

  // 删除菜单
  deleteMenu(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 重新排序菜单
  // reorderMenus(reorderDto: ReorderMenuDto): Observable<IMenuNode[]> {
  //   return this.http.post<IMenuNode[]>(`${this.apiUrl}/reorder`, reorderDto);
  // }
}
