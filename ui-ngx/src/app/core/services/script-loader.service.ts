import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { concatMap, catchError, delay, last, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  /**
   * 'jquery.min.js': false,
   *  'jquery-ui.min.js': false,
   *  'jquery.ui-contextmenu.min.js': false,
   *  'jquery.fancytree-all.min.js': false,
   */
  private scripts: { [key: string]: boolean } = {};
  private loadingStatus: boolean = false;

  constructor() {}

  getLoadingStatus(): boolean {
    return this.loadingStatus;
  }

  loadScripts(scripts: string[]): Observable<any> {
    this.loadingStatus = true; // 开始加载时设置为true
    return from(scripts).pipe(
      concatMap((script) => this.insertScriptElement(script)),
      last(),
      tap(() => {
        this.loadingStatus = false; // 全部加载完成后设置为false
      }),
      catchError((error) => {
        console.error('Error loading script:', error);
        this.loadingStatus = false; // 加载失败也设置为false
        return throwError(() => new Error('Script loading failed'));
      }),
    );
  }

  private insertScriptElement(script: string): Observable<any> {
    if (this.scripts[script]) {
      return new Observable((subscriber) => {
        subscriber.next();
        subscriber.complete();
      });
    }

    return new Observable((subscriber) => {
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = script;
      scriptElement.onload = () => {
        this.scripts[script] = true;
        subscriber.next();
        subscriber.complete();
      };
      scriptElement.onerror = (error) => {
        subscriber.error(error);
      };
      document.body.appendChild(scriptElement);
    });
  }
}
