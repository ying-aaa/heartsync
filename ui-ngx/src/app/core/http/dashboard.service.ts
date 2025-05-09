import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = '/api/dashboards'; // 替换为你的API地址

  constructor(private http: HttpClient) {}

  // 获取单个仪表盘
  getDashboard(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 获取所有仪表盘
  getAllDashboards(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 创建仪表盘
  createDashboard(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // 更新仪表盘
  updateDashboard(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // 删除仪表盘
  removeDashboard(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
