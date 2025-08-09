import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import { IBaseResponseData, IResponseStructure } from './request.model';

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

export interface IAppConfig extends IBaseResponseData {
  directoryId: string;
  name: string;
  type?: string; // 默认值为 'web'
  imageUrl?: string;
  description?: string;
  version?: string;
  status: string;
  tags?: any;
}
@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = '/api/applications';

  constructor(private http: HttpClient) {}

  // 创建应用
  createApplication(
    createApplicationDto: CreateApplicationDto,
  ): Observable<IAppConfig> {
    return this.http.post<IAppConfig>(this.apiUrl, createApplicationDto);
  }

  // 获取所有应用（分页）
  findAllApplications(
    pageLink: PageLink,
  ): Observable<IResponseStructure<IAppConfig>> {
    const params = pageLink.toQueryHttp();
    return this.http.get<IResponseStructure<IAppConfig>>(this.apiUrl, {
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
  findApplicationById(id: string): Observable<IAppConfig> {
    return this.http.get<IAppConfig>(`${this.apiUrl}/${id}`);
  }

  // 更新应用
  updateApplication(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Observable<IAppConfig> {
    return this.http.put<IAppConfig>(
      `${this.apiUrl}/${id}`,
      updateApplicationDto,
    );
  }

  // 删除应用
  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
