import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import { IBaseResponseData, IResponseStructure } from './request.model';
import { IAppData, IAppWithConfig } from '@heartsync/types';

// 定义类型
export interface CreateApplicationDto {
  directoryId: string;
  name: string;
  description: string;
  imageUrl?: string;
  // 其他字段根据实际需求添加
}

export interface UpdateApplicationDto {
  name?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = '/api/applications';

  constructor(private http: HttpClient) {}

  // 创建应用
  createApplication(createApplicationDto: CreateApplicationDto): Observable<IAppData> {
    return this.http.post<IAppData>(this.apiUrl, createApplicationDto);
  }

  // 获取所有应用（分页）
  findAllApplications(pageLink: PageLink): Observable<IResponseStructure<IAppData>> {
    const params = pageLink.toQueryHttp();
    return this.http.get<IResponseStructure<IAppData>>(this.apiUrl, {
      params,
    });
  }

  // 判断某个目录下是否有应用
  checkDataExists(directoryId: string): Observable<{ hasData: boolean }> {
    const params = { directoryId };
    return this.http.get<{ hasData: boolean }>(`${this.apiUrl}/check-data`, {
      params,
    });
  }

  // 根据ID获取单个应用
  getAppWithConfigById(id: string): Observable<IAppWithConfig> {
    return this.http.get<IAppWithConfig>(`${this.apiUrl}/${id}`);
  }

  // 更新应用
  updateApplication(id: string, appData: IAppWithConfig): Observable<IAppWithConfig> {
    return this.http.put<IAppWithConfig>(`${this.apiUrl}/${id}`, appData);
  }

  // 删除应用
  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
