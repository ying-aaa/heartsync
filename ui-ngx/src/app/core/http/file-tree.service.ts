import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateNodeDto {
  businessId: string;
  parentId?: string;
  name: string;
  type: string;
  meta?: any;
}

export interface UpdateNodeDto {
  name?: string;
  meta?: any;
}

export interface MoveNodeDto {
  newParentId?: string;
  businessId: string;
  newName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileTreeService {
  private apiUrl = '/api/nodes'; // 根据实际情况调整 API 地址

  constructor(private http: HttpClient) {}

  // 创建新节点
  createNode(dto: CreateNodeDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  // 更新节点信息
  updateNode(id: number, dto: UpdateNodeDto): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, dto);
  }

  // 移动节点
  moveNode(id: number, dto: MoveNodeDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/move/${id}`, dto);
  }

  // 删除节点
  deleteNode(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 获取整个树结构
  getEntireTree(businessId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tree`, { params: { businessId } });
  }

  // 获取子节点列表
  getChildren(parentId?: number, businessId?: string): Observable<any> {
    const params = { parentId: parentId?.toString(), businessId };
    // @ts-ignore
    return this.http.get(`${this.apiUrl}/children`, { params });
  }
}
