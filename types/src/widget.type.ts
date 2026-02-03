import { IBaseData, IWhetherStatus } from './system.type';
// import { FormlyFieldConfig } from '@ngx-formly/core';
export interface FormlyFieldConfig {}

export enum IWidgetType {
  CODE = 'code', // 代码组件
  CHART = 'chart', // 图表组件
  CESIUM = 'cesium', // Cesium 3D 地图组件
  X6 = 'x6', // 流程图组件
  FORM = 'form', // 表单组件
  LIST = 'list', // 列表组件
  DETAIL = 'detail', // 详情组件
}

export enum IEditSizeType {
  FILL = 'fill', // 撑满
  MOBILE = 'mobile', // 移动端
  IPAD = 'ipad', // 平板
  PC = 'pc', // 电脑端
  CUSTOM = 'custom', // 自定义
}

export enum IFormWidgetSubTypes {
  FLAT = 'flat', // 网格布局
  CANVAS = 'canvas', // 网格布局
}

export enum ICodeWidgetSubTypes {
  ANGULAR = 'angular',
  SCOPE = 'scope',
  REACT = 'react',
  VUE = 'vue',
  JS = 'js',
}

export interface IWidgetSettings {
  anableFullscreen: boolean;
  showTitle: boolean;
  showTitleIcon: boolean;
  title: string;
  titleTooltip: string;
  icon: string;
  containerStyle: Record<string, string>;
  titleStyle: Record<string, string>;
  iconStyle: Record<string, string>;
  widgetStyle: Record<string, string>;
}

export interface IWidgetBaseConfig {
  id: string;
  name: string;
  appId: string;
  type: IWidgetType;
  settings: IWidgetSettings;
}

export interface IFormButtonConfig {}

export interface IEditorFormlyField extends FormlyFieldConfig {
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

export interface IResourceScript {
  resourceUrl: string;
  isModule: boolean;
}

export interface IFormWidgetConfig extends IWidgetBaseConfig, IBaseData {
  subType: IFormWidgetSubTypes;
  flatTypeField?: IEditorFormlyField[];
  canvasTypeField?: any[];
  useFlow?: IWhetherStatus;
  buttonConfig?: IFormButtonConfig;
}

export interface ICodeWidgetConfig extends IWidgetBaseConfig, IBaseData {
  subType: ICodeWidgetSubTypes;
  templateHtml: string;
  templateCss: string;
  templateJs: string;
  resourceScript: Array<IResourceScript>;
}

export interface IListWidgetConfig extends IWidgetBaseConfig {}

export type IWidgetTypesConfig =
  | IFormWidgetConfig
  | ICodeWidgetConfig
  | IListWidgetConfig;
