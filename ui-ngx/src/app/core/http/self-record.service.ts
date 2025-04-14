import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelfRecordService {
  private apiUrl = '/api/self-records'; // 替换为你的后端地址

  constructor(private http: HttpClient) {}

  create(record: any): Observable<any> {
    return this.http.post(this.apiUrl, record);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOne(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  update(id: number, record: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, record);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
