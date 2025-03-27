import { FormlyFieldConfig } from '@ngx-formly/core';

export interface IEditorFormlyField extends FormlyFieldConfig {
  /**
   * 组件的显示名称
   */
  label?: string;
  fieldArray?: any;
  fieldGroup?: IEditorFormlyField[];
  fieldId?: string;
  parent?: IEditorFormlyField;
  index?: number;
  canHaveChildren?: boolean;
  childrenPath?: string; // Lodash path
  _design?: boolean;
  _form?: true;
  _bindKey?: true;
}

export enum IFieldType {
  FIELDSET = 'fieldset',
  GRID = 'grid',
  ROW = 'row',
  COLUMN = 'column',
  FLEX = 'flex',
  MATTABS = 'tabs',
  SUBTABLE = 'subtable',
}

export enum ICdkDrapActionType {
  COPY = 'copy',
  MOVE = 'move',
  DELETE = 'delete',
  TRANSFER = 'transfer',
}

// 设备类型枚举
export enum IEditSizeType {
  FILL = 'fill', // 撑满
  MOBILE = 'mobile', // 移动端
  IPAD = 'ipad', // 平板
  PC = 'pc', // 电脑端
  CUSTOM = 'custom', // 自定义
}

// 组件类型枚举
export enum IWidgetType {
  CODE = 'code', // 代码组件
  CHART = 'chart', // 图表组件
  CESIUM = 'cesium', // Cesium 3D 地图组件
  X6 = 'x6', // 流程图组件
  FORM = 'form', // 表单组件
  LIST = 'list', // 列表组件
  DETAIL = 'detail', // 详情组件
}

// 编辑尺寸配置接口
export interface IEditSizeConfig {
  type: IEditSizeType; // 设备类型
  size: {
    width: number;
    widthUnits: string;
    height: number;
    heightUnits: string;
  };
}

// 组件样式配置接口
export interface IWidgetStyleConfig {}

// 数据源配置接口
export interface IDataSourceConfig {}

// 部件变量
export interface IFormVariablesConfig {}

// 组件配置接口
export interface IBaseWidgetConfig {
  id?: number; // 组件唯一标识
  appId?: string;
  dashboardId?: string;
  workspaceName: string; // 工作台名称
  type?: IWidgetType; // 组件类型（表单、列表、详情、图表等）
  workSizeConfig?: IEditSizeConfig; // 工作区尺寸配置
  styleConfig?: IWidgetStyleConfig; // 组件样式配置
  dataSourceConfig?: IDataSourceConfig; // 数据源配置
  createTime?: Date;
  createUser?: string;
  lastUpdateTime?: Date;
  lastUpdateUser?: string;
  variablesConfig?: IFormVariablesConfig;
}
