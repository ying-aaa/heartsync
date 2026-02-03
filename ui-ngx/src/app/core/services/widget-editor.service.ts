import { effect, Injectable, signal } from '@angular/core';
import { IRadioConfig, IWidgetType } from '@src/app/shared/models/public-api';
import { Router } from '@angular/router';
import { WidgetService } from '../http/widget.service';
import { FormEditorService } from './form-editor.service';

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

export const widgetTypeIcons = {
  code: 'code',
  chart: 'insert_chart',
  cesium: 'public',
  x6: 'device_hub',
  form: 'assignment',
  list: 'view_list',
  detail: 'info',
};

export const flatWidgetTypesList = new Map(
  widgetTypesList.map(({ label, value }) => [value, label]),
);

@Injectable()
export class WidgetEditorService {
  widgetId = signal<string | null>(null);

  widgetConfig = signal<any>({} as any);

  widgetType = signal<IWidgetType>(IWidgetType.FORM);

  constructor(
    private router: Router,
    private WidgetHttpService: WidgetService,
  ) {}

  setWidgetId(widgetId: string | null, load: boolean = false) {
    this.widgetId.set(widgetId);
    if (widgetId === null) return this.widgetConfig.set({} as any);
    load && this.loadWidgetInfo();
  }

  loadWidgetInfo() {
    this.WidgetHttpService.getWidgetById(this.widgetId()!, this.widgetType()).subscribe((res) => {
      this.widgetConfig.set(res);
    });
  }

  previewWidget(appId?: string, widgetId?: string, widgetType?: IWidgetType) {
    appId = appId || this.widgetConfig().appId;
    widgetId = widgetId || this.widgetId()!;
    widgetType = widgetType || this.widgetType();

    this.router.navigate([`/design/${appId}/widget/preview`], {
      queryParams: { widgetId, widgetType },
    });
  }
}
