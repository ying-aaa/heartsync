import { computed, effect, Injectable, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRadioConfig, IWidgetType } from '@src/app/shared/models/public-api';
import { Location } from '@angular/common';
import { FormWidgetService } from '@src/app/core/http/form-widget.service';
import { IFormWidgetConfig } from '@src/app/shared/models/form-widget.model';

export interface IWidgetSelected {
  widgetName?: string;
  id?: number;
}

export const widgetTypesList: IRadioConfig[] = [
  { label: '代码', value: 'code' },
  { label: '图表', value: 'chart' },
  { label: 'cesium', value: 'cesium' },
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

  public currentWidgetType = signal<IWidgetType>(IWidgetType.FORM);

  public currentWidgetConfig = signal<IFormWidgetConfig>(
    {} as IFormWidgetConfig,
  );

  constructor() {
    effect(() => {
      if (this.currentWidgetType()) {
        this.currentWidgetId.set('');
      }
    });
  }

  setWidgetId(widgetId: string) {
    if (widgetId === this.currentWidgetId()) return;
    this.currentWidgetId.set(widgetId);
  }
}
