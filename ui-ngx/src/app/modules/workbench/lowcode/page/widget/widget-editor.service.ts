import { Injectable, signal } from '@angular/core';
import { IRadioConfig } from '@src/app/shared/models/public-api';

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
  public activeMode = signal<string>('form');

  public activeWidget = signal<IWidgetSelected>({});

  constructor() {}
}
