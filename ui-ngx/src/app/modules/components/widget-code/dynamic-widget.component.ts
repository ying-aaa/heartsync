import { Directive, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { widgetContextToken } from '@src/app/shared/models/widget-component.model';
import { HsThemeService } from '@src/app/core/services/theme.service';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DynamicWidgetComponent implements OnInit, OnDestroy {
  public readonly $injector = inject(Injector);
  public readonly ctx = {} as any;

  constructor() {
    this.ctx.$injector = this.$injector;
    this.ctx.http = this.$injector.get(HttpClient);
    this.ctx.sanitizer = this.$injector.get(DomSanitizer);
    this.ctx.router = this.$injector.get(Router);
    this.ctx.theme = this.$injector.get(HsThemeService);

    this.ctx.$scope = this;
  }

  ngOnInit() {}

  ngOnDestroy(): void {}
}
