import { IBaseData } from './system.type';
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
  type: IWidgetType;
  layerIndex: number;
  isNew?: 1;
}

export interface IDashboardGridsterConfig {
  gridsterOption: any;
  gridsterWidget: IDashboardWidgetConfig[];
}

export interface IDashboardEntity extends IBaseData {
  id: string;
  name: string;
  type: IDashboardType;
  appId: string;
  description: string;
  gridsterConfig: IDashboardGridsterConfig;
}

export interface IDashboardConfig extends IDashboardEntity {
  widgets?: {
    [key in string]: IWidgetTypesConfig;
  };
}
