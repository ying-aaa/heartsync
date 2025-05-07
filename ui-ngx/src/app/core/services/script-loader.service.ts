import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { concatMap, catchError, delay, last, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private scripts: { [key: string]: boolean } = {};
  private loadingStatus: boolean = false;

  constructor() {}

  getLoadingStatus(): boolean {
    return this.loadingStatus;
  }

  loadScripts(scripts: string[]): Observable<any> {
    this.loadingStatus = true; 

    if (scripts.length === 0) {
      this.loadingStatus = false; 
      return of(null);
    }

    return from(scripts).pipe(
      concatMap((script) => this.insertScriptElement(script)),
      last(),
      tap(() => {
        this.loadingStatus = false; // 全部加载完成后设置为false
      }),
      catchError((error) => {
        this.loadingStatus = false; // 加载失败也设置为false
        return throwError(() => new Error('Script loading failed', error));
      }),
    );
  }

  private insertScriptElement(script: string): Observable<any> {
    // 判断是否是标签字符
    if (script.startsWith('<script') || script.startsWith('<link')) {
      return new Observable((subscriber) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(script, 'text/html');
        const scriptElement = doc.head.firstChild;
        if (scriptElement) {
          document.head.appendChild(scriptElement);
          subscriber.next();
          subscriber.complete();
        } else {
          subscriber.error(new Error('Invalid script tag'));
        }
      });
    }

    // 判断是否是资源路径字符
    const scriptUrl = script.trim();
    if (!scriptUrl.endsWith('.js') && !scriptUrl.endsWith('.css')) {
      return throwError(() => new Error('Unsupported file type'));
    }

    if (this.scripts[scriptUrl]) {
      return of(null);
    }

    if (scriptUrl.endsWith('.js')) {
      return new Observable((subscriber) => {
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = scriptUrl;
        scriptElement.onload = () => {
          this.scripts[scriptUrl] = true;
          subscriber.next();
          subscriber.complete();
        };
        scriptElement.onerror = (error) => {
          subscriber.error(error);
        };
        document.body.appendChild(scriptElement);
      });
    } else if (scriptUrl.endsWith('.css')) {
      return new Observable((subscriber) => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = scriptUrl;
        linkElement.onload = () => {
          this.scripts[scriptUrl] = true;
          subscriber.next();
          subscriber.complete();
        };
        linkElement.onerror = (error) => {
          subscriber.error(error);
        };
        document.head.appendChild(linkElement);
      });
    } else {
      return throwError(() => new Error('Unsupported file type'));
    }
  }
}
