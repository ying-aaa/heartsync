import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { concatMap, catchError, delay, last } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private scripts: { [key: string]: boolean } = {
    'jquery.min.js': false,
    'jquery-ui.min.js': false,
    'jquery.ui-contextmenu.min.js': false,
    'jquery.fancytree-all.min.js': false,
  };

  constructor() {}

  loadScripts(scripts: string[]): Observable<any> {
    return from(scripts).pipe(
      concatMap((script) => this.insertScriptElement(script)),
      last(),
      catchError((error) => {
        console.error('Error loading script:', error);
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
