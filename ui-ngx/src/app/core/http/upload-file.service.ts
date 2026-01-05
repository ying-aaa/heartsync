// src/app/services/upload-file.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HS_BUCKET } from '@src/app/shared/models/system.model';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
/**
 * 创建分类 DTO
 */
export interface CreateCategoryDto {
  bucket?: string;
  name: string;
}

/**
 * 更新分类 DTO
 */
export interface UpdateCategoryDto {
  name?: string;
  parent_id?: string;
  sort_order?: number;
}

/**
 * 更新资源信息 DTO
 */
export interface UpdatedResourceDto {
  name?: string;
  category_id?: string;
  access?: 'public' | 'private';
}

/**
 * 上传资源时的参数
 */
export interface UploadResourceParams {
  bucket: string;
  path?: string;
  access: 'public' | 'private';
}

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  // 注意：这里的 API URL 应与后端 Controller 的 @Controller('files') 装饰器匹配
  private apiUrl = 'api/files';

  private bucket = HS_BUCKET;

  constructor(private http: HttpClient) {}

  /**
   * 创建存储桶
   * @param bucketName 存储桶名称
   */
  createBucket(bucketName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/buckets/${bucketName}`, {});
  }

  /**
   * 创建分类
   * @param category 分类信息
   */
  createCategory(category: CreateCategoryDto): Observable<any> {
    category.bucket = this.bucket;
    return this.http.post(`${this.apiUrl}/categories`, category);
  }

  /**
   * 修改分类
   * @param id 分类 ID
   * @param category 新的分类信息
   */
  updateCategory(id: string, category: UpdateCategoryDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${id}`, category);
  }

  getCategories(): Observable<any> {
    const params = new HttpParams().set('bucket', this.bucket);
    return this.http.get(`${this.apiUrl}/categories`, { params });
  }

  /**
   * 获取指定分类下的资源列表
   * @param categoryId 分类 ID
   */
  getResourcesByCategory(categoryId: string, pageLink: PageLink): Observable<any> {
    const params = new HttpParams().set('bucket', this.bucket).set('category_id', categoryId);
    return this.http.get(`${this.apiUrl}/category`, { params });
  }

  /**
   * 根据资源 ID 获取资源信息
   * @param id 资源 ID
   */
  getResourceById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/${id}`);
  }

  /**
   * 上传资源
   * @param file 要上传的文件
   * @param params 上传参数 (bucket, path, access)
   */
  uploadResource(file: File, params: UploadResourceParams): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const httpParams = new HttpParams()
      .set('bucket', params.bucket)
      .set('path', params.path || '')
      .set('access', params.access);

    return this.http.post(`${this.apiUrl}/upload`, formData, { params: httpParams });
  }

  /**
   * 修改资源信息
   * @param id 资源 ID
   * @param resource 新的资源信息
   */
  updateResource(id: string, resource: UpdatedResourceDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/resources/${id}`, resource);
  }

  /**
   * 删除资源
   * @param bucket 存储桶名称
   * @param id 资源 ID
   * @param path 资源路径
   */
  deleteFile(bucket: string, path: string): Observable<any> {
    const params = new HttpParams().set('bucket', bucket).set('path', path);
    return this.http.delete(`${this.apiUrl}`, { params });
  }
}
