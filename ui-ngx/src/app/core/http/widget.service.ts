import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWidgetType } from '@src/app/shared/models/widget.model';

export interface CreateWidgetDto {
  name: string;
  appId: string,
  type: IWidgetType,
  nodeId?: string;
}

export interface UpdateWidgetDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  private apiUrl = '/api/widgets'; // 替换为你的后端 URL

  constructor(private http: HttpClient) {}

  // 创建 Widget
  createWidget(createDto: CreateWidgetDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, createDto);
  }

  // 获取所有 Widgets
  findAllWidget(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 根据 ID 获取单个 Widget
  getWidgetById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 更新 Widget
  updateWidget(id: string, updateDto: UpdateWidgetDto): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, updateDto);
  }

  // 删除 Widget
  removeWidget(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}