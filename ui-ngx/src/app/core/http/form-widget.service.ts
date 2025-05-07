// src/app/services/form-widget.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IFormWidgetConfig } from '@shared/models/form-widget.model'; // 确保引入正确的类型

@Injectable({
  providedIn: 'root',
})
export class FormWidgetService {
  private apiUrl = '/api/widget/form'; // 对应后端的接口路径

  constructor(private http: HttpClient) {}

  // 获取所有表单部件
  getAllFormWidgets(): Observable<IFormWidgetConfig[]> {
    return this.http
      .get<IFormWidgetConfig[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  // 根据ID获取表单部件
  getFormWidgetById(id: number | string): Observable<IFormWidgetConfig> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<IFormWidgetConfig>(url)
      .pipe(catchError(this.handleError));
  }

  // 创建新表单部件
  createFormWidget(
    formWidget: IFormWidgetConfig,
  ): Observable<IFormWidgetConfig> {
    return this.http
      .post<IFormWidgetConfig>(`${this.apiUrl}`, formWidget)
      .pipe(catchError(this.handleError));
  }

  // 更新表单部件
  updateFormWidget(
    formWidget: IFormWidgetConfig,
  ): Observable<IFormWidgetConfig> {
    const url = `${this.apiUrl}/${formWidget.widgetId}`;
    return this.http
      .put<IFormWidgetConfig>(url, formWidget)
      .pipe(catchError(this.handleError));
  }

  // 删除表单部件
  deleteFormWidget(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  // 错误处理
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
