import { IBaseData, IWhetherStatus } from './system.type';
import { IWidgetType, IWidgetTypesConfig } from './widget.type';

export enum IDashboardType {
  GRIDSTER = 'gridster',
}

export interface IDashboardWidgetConfig {
  x: number;
  y: number;
  id: string;
  cols: number;
  name: string;
  rows: number;
  widgetId: string;
  type: IWidgetType;
  layerIndex: number;
  isNew?: IWhetherStatus;
}

export interface IDashboardGridsterConfig {
  gridsterOption: any;
  gridsterWidgets: IDashboardWidgetConfig[];
}

export interface IDashboardEntity extends IBaseData {
  nodeId?: string;
  id: string;
  name: string;
  type: IDashboardType;
  appId: string;
  description: string;
  gridsterConfig: IDashboardGridsterConfig;
}

export type IWidgetContext = Record<string, IWidgetTypesConfig>;

export interface IDashboardConfig extends IDashboardEntity {
  widgets?: IWidgetContext;
}
