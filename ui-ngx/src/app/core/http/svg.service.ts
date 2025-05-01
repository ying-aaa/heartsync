// svg.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SvgService {
  private cache = new Map<string, string>();

  constructor(private http: HttpClient) {}

  loadSvg(name: string): Observable<string> {
    const cached = this.cache.get(name);
    if (cached) {
      return of(cached);
    }

    const path = `assets/svg/${name}.svg`;
    return this.http.get(path, { responseType: 'text' }).pipe(
      catchError(() => of('')),
      shareReplay(1),
      tap((svg) => {
        if (svg) this.cache.set(name, svg);
      }),
    );
  }
}
