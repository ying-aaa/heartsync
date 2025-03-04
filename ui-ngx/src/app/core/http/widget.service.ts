// src/app/services/widget.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Widget {
  id?: number;
  title?: string;
  key?: string;
  type?: string; // 部件类型（表单、列表、详情、图表等）
  config?: any; // 部件配置项
}

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  private apiUrl = '/api'; // 对应后端的接口路径

  constructor(private http: HttpClient) {}

  // 获取所有部件
  getAllWidgets(): Observable<Widget[]> {
    return this.http
      .get<Widget[]>(`${this.apiUrl}/widgets`)
      .pipe(catchError(this.handleError));
  }

  // 根据ID获取部件
  getWidgetById(id: number): Observable<Widget> {
    const url = `${this.apiUrl}/widgets/${id}`;
    return this.http.get<Widget>(url).pipe(catchError(this.handleError));
  }

  // 创建新部件
  createWidget(widget: Widget): Observable<Widget> {
    return this.http
      .post<Widget>(`${this.apiUrl}/widgets`, widget)
      .pipe(catchError(this.handleError));
  }

  // 更新部件
  updateWidget(widget: Widget): Observable<Widget> {
    const url = `${this.apiUrl}/widgets/${widget.id}`;
    return this.http
      .put<Widget>(url, widget)
      .pipe(catchError(this.handleError));
  }

  // 删除部件
  deleteWidget(id: number): Observable<any> {
    const url = `${this.apiUrl}/widgets/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  // 错误处理
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
