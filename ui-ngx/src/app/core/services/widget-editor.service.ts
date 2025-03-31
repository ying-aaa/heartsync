import { computed, effect, Injectable, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRadioConfig, IWidgetType } from '@src/app/shared/models/public-api';
import { Location } from '@angular/common';
import { FormWidgetService } from '@app/core/http/widget.service';
import { IFormWidgetConfig } from '@src/app/shared/models/form-widget.model';

export interface IWidgetSelected {
  widgetName?: string;
  id?: number;
}

export const widgetTypesList: IRadioConfig[] = [
  { label: '代码', value: 'code' },
  { label: '图表', value: 'chart' },
  { label: '地图', value: 'map' },
  { label: 'x6', value: 'x6' },
  { label: '表单', value: 'form' },
  { label: '列表', value: 'list' },
  { label: '详情', value: 'detail' },
];

export const flatWidgetTypesList = new Map(
  widgetTypesList.map(({ label, value }) => [value, label]),
);

@Injectable({
  providedIn: 'root',
})
export class WidgetEditorService {
  public currentWidgetId = signal<string>('');

  public currentWidgetConfig = signal<IFormWidgetConfig>(
    {} as IFormWidgetConfig,
  );

  public currentWidgetType = signal<IWidgetType>(IWidgetType.FORM);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formWidgetService: FormWidgetService,
  ) {
    this.initRouteWidget();
  }

  private initRouteWidget() {
    const widgetId = this.route.snapshot.queryParams['widgetId'];
    this.setWidgetId(widgetId);
  }

  setWidgetId(widgetId: string) {
    this.currentWidgetId.set(widgetId);
    this.updateProductId(widgetId);
    this.getWidgetConfig(widgetId);
  }

  updateProductId(widgetId: string) {
    if (!widgetId) return;
    const currentPath = this.location.path().split('?')[0];
    const newUrl = `${currentPath}?widgetId=${widgetId}`;
    this.location.go(newUrl);
  }

  getWidgetConfig(widgetId: string) {
    widgetId = widgetId || this.currentWidgetId();
    if (!widgetId) return;
    this.formWidgetService.getFormWidgetById(widgetId).subscribe({
      next: (widgetConfig: IFormWidgetConfig) => {
        this.currentWidgetConfig.set(widgetConfig);
      },
      error: (err: any) => console.error('Get widget error:', err),
    });
  }
}
