import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private apiUrl = 'api/files'; // 替换为你的后端服务地址

  constructor(private http: HttpClient) {}

  // 创建存储桶
  createBucket(bucketName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/buckets/${bucketName}`, {});
  }

  // 文件上传
  uploadFile(
    file: File,
    bucket: string,
    path?: string,
    access: 'public' | 'private' = 'public',
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new HttpParams()
      .set('bucket', bucket)
      .set('path', path || '')
      .set('access', access);

    return this.http.post(`${this.apiUrl}/upload`, formData, { params });
  }

  // 文件地址查询
  getFileUrl(
    bucket: string,
    path?: string,
    type: 'public' | 'private' = 'public',
  ): Observable<any> {
    const params = new HttpParams()
      .set('bucket', bucket)
      .set('path', path || '')
      .set('type', type);

    return this.http.get(`${this.apiUrl}/url`, { params });
  }

  // 文件列表查询
  listFiles(bucket: string, path?: string): Observable<any> {
    const params = new HttpParams()
      .set('bucket', bucket)
      .set('path', path || '');

    return this.http.get(`${this.apiUrl}/list`, { params });
  }

  // 文件删除
  deleteFile(bucket: string, path: string): Observable<any> {
    const params = new HttpParams().set('bucket', bucket).set('path', path);

    return this.http.delete(`${this.apiUrl}`, { params });
  }
}
