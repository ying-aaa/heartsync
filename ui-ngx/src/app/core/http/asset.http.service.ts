// asset-http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseStructure, IBaseResponseData } from './request.model';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';

export interface IAsset extends IBaseResponseData {
  id: string;
  name: string;
  appId: string;
  /* 根据 hs-asset-table.entity 补充其余字段 */
}

export interface IAssetField extends IBaseResponseData {
  id: string;
  assetId: string;
  fieldName: string;
  fieldType: string;
  /* 其余字段 */
}

@Injectable({ providedIn: 'root' })
export class AssetHttpService {
  private readonly apiUrl = '/api/asset';

  constructor(private http: HttpClient) {}

  /* 创建资产 */
  create(data: Partial<IAsset>): Observable<IAsset> {
    return this.http.post<IAsset>(this.apiUrl, data);
  }

  /* 同步资产字段（扫描表结构） */
  syncFields(assetId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${assetId}/sync-field`, {});
  }

  /* 查询资产字段列表 */
  getFields(assetId: string): Observable<IAssetField[]> {
    return this.http.get<IAssetField[]>(`${this.apiUrl}/${assetId}/find-field`);
  }

  /* 查询指定应用下的资产 */
  findAllByAppId(appId: string): Observable<IAsset[]> {
    return this.http.get<IAsset[]>(`${this.apiUrl}/app/${appId}`);
  }

  /* 分页获取所有资产 */
  findAll(pageLink: PageLink): Observable<IResponseStructure<IAsset>> {
    const params = pageLink.toQueryHttp();
    return this.http.get<IResponseStructure<IAsset>>(this.apiUrl, { params });
  }

  /* 查询资产业务数据 */
  findAssetData(assetId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${assetId}/find`);
  }
}
