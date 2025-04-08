import { Component, Injectable, Type } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { mergeMap } from 'rxjs/operators';
import { generateUUID } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentFactoryService {

  constructor() {}

  public createDynamicComponent<T>(
    baseComponent: Type<T>,
    template: string,
    imports: Type<any>[] = [],
    preserveWhitespaces: boolean = false,
    styles: string[] = []
  ): Observable<Type<T>> {
    return from(import('@angular/compiler')).pipe(
      mergeMap(() => {
        const componentImports: Type<any>[] = [CommonModule, ...imports];
        const dynamicComponent = this.compileDynamicComponent(
          baseComponent,
          template,
          componentImports,
          preserveWhitespaces,
          styles
        );
        return of(dynamicComponent);
      })
    );
  }

  private compileDynamicComponent<T>(
    baseComponent: Type<T>,
    template: string,
    imports: Type<any>[],
    preserveWhitespaces: boolean,
    styles: string[]
  ): Type<T> {
    return Component({
      template,
      imports,
      preserveWhitespaces,
      styles,
      selector: `hs-dynamic-component#${generateUUID()}`
    })(baseComponent);
  }
}