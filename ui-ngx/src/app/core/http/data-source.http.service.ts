// data-source-http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import { IBaseResponseData, IResponseStructure } from './request.model';

export interface IDataSource extends IBaseResponseData {
  appId: string;
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  database?: string;
  status: string;
  options?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class DataSourceHttpService {
  private readonly apiUrl = '/api/data-sources';

  constructor(private http: HttpClient) {}

  /* 创建数据源 */
  create(data: IDataSource): Observable<IDataSource> {
    return this.http.post<IDataSource>(this.apiUrl, data);
  }

  /* 测试数据源连接（未保存） */
  testConnection(data: IDataSource): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(`${this.apiUrl}/test`, data);
  }

  /* 获取所有数据源（分页） */
  findAll(pageLink: PageLink): Observable<IResponseStructure<IDataSource>> {
    const params = pageLink.toQueryHttp();
    return this.http.get<IResponseStructure<IDataSource>>(this.apiUrl, { params });
  }

  /* 获取单个数据源详情 */
  findOne(id: string): Observable<IDataSource> {
    return this.http.get<IDataSource>(`${this.apiUrl}/${id}`);
  }

  /* 根据已保存的 ID 测试连接 */
  testConnectionById(id: string): Observable<{ success: boolean; message?: string }> {
    return this.http.get<{ success: boolean; message?: string }>(`${this.apiUrl}/${id}/test`);
  }

  /* 更新数据源 */
  update(id: string, dto: IDataSource): Observable<IDataSource> {
    return this.http.put<IDataSource>(`${this.apiUrl}/${id}`, dto);
  }

  /* 删除数据源 */
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 获取数据源下的数据库模式
  getSchemas(id: string): Observable<{ schema_name: string }[]> {
    return this.http.get<{ schema_name: string }[]>(`${this.apiUrl}/${id}/schemas`);
  }

  // // 获取数据源下的数据库模式下的表
  getTables(id: string, schemaName: string): Observable<{ table_name: string }[]> {
    const params = new HttpParams().set('schemaName', schemaName);
    return this.http.get<{ table_name: string }[]>(`${this.apiUrl}/${id}/tables`, { params });
  }
}
