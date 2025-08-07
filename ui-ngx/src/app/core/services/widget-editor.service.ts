import { effect, Injectable, signal } from '@angular/core';
import { IRadioConfig, IWidgetType } from '@src/app/shared/models/public-api';
import { IFormWidgetConfig } from '@src/app/shared/models/form-widget.model';
import { Router } from '@angular/router';
import { WidgetService } from '../http/widget.service';

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

  public currentWidgetConfig = signal<any>(
    {} as any,
  );

  constructor(
    private router: Router,
    private WidgetHttpService: WidgetService,
  ) {
    effect(() => {
      if (this.currentWidgetType()) {
        this.currentWidgetId.set('');
      }
    });
  }

  setWidgetId(widgetId: string) {
    if (widgetId === this.currentWidgetId()) return;
    this.currentWidgetId.set(widgetId);
    this.loadWidgetInfo();
  }

  loadWidgetInfo() {
    this.WidgetHttpService.findOneWidget(this.currentWidgetId()).subscribe((res) => {
      this.currentWidgetConfig.set(res);
    });
  }

  previewWidget(appId: string, widgetId: number, widgetType: IWidgetType) {
    this.router.navigate([`/design/${appId}/widget/preview`], {
      queryParams: { widgetId, widgetType },
    });
  }
}
