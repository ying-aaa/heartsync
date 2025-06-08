import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private tokenInfoUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

  constructor(private http: HttpClient) {}

  /**
   * 检测是否为海外网络
   * @returns 返回一个Observable，表示是否为海外网络
   */
  isOverseasNetwork(): Observable<boolean> {
    const idToken = 'xxx';
    const url = `${this.tokenInfoUrl}?id_token=${idToken}`;

    return this.http.get<any>(url).pipe(
      timeout(2000),
      map(() => true),
      catchError((error) => {
        return of(!!error.status);
      }),
    );
  }
}
