///
/// Copyright © 2016-2025 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///


import { Directive, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { widgetContextToken } from '@src/app/shared/models/widget-component.model';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DynamicWidgetComponent  implements OnInit, OnDestroy {

  executingRpcRequest: boolean;
  rpcEnabled: boolean;
  rpcErrorText: string;
  rpcRejection: HttpErrorResponse | Error;

  [key: string]: any;

  validators = Validators;

  public fb = inject(UntypedFormBuilder);
  public readonly $injector = inject(Injector);
  public readonly ctx = {} as any;

  constructor() {
    this.ctx.$injector = this.$injector;
    this.ctx.http = this.$injector.get(HttpClient);
    this.ctx.sanitizer = this.$injector.get(DomSanitizer);
    this.ctx.router = this.$injector.get(Router);

    this.ctx.$scope = this;
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }
}
