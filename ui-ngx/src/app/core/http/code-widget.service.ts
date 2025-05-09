// src/app/services/code-widget.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICodeWidgetConfig } from '@shared/models/code-widget.model'; // 确保引入正确的类型

@Injectable({
  providedIn: 'root',
})
export class CodeWidgetService {
  private apiUrl = '/api/widget/code'; // 对应后端的接口路径

  constructor(private http: HttpClient) {}

  // 获取所有代码部件
  getAllCodeWidgets(): Observable<ICodeWidgetConfig[]> {
    return this.http
      .get<ICodeWidgetConfig[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  // 根据ID获取代码部件
  getCodeWidgetById(widgetId: string): Observable<ICodeWidgetConfig> {
    const url = `${this.apiUrl}/${widgetId}`;
    return this.http
      .get<ICodeWidgetConfig>(url)
      .pipe(catchError(this.handleError));
  }

  // 创建新代码部件
  createCodeWidget(
    codeWidget: ICodeWidgetConfig,
  ): Observable<ICodeWidgetConfig> {
    return this.http
      .post<ICodeWidgetConfig>(`${this.apiUrl}`, codeWidget)
      .pipe(catchError(this.handleError));
  }

  // 更新代码部件
  updateCodeWidget(
    codeWidget: ICodeWidgetConfig,
  ): Observable<ICodeWidgetConfig> {
    const url = `${this.apiUrl}/${codeWidget.id}`;
    return this.http
      .put<ICodeWidgetConfig>(url, codeWidget)
      .pipe(catchError(this.handleError));
  }

  // 删除代码部件
  deleteCodeWidget(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  // 错误处理
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
