import { FormlyFieldConfig } from '@ngx-formly/core';

export interface IEditorFormlyField extends FormlyFieldConfig {
  /**
   * 组件的显示名称
   */
  label?: string;
  fieldGroup?: IEditorFormlyField[];
  fieldId?: string;
  parent?: IEditorFormlyField;
  index?: number;
  canHaveChildren?: boolean;
  childrenPath?: string; // Lodash path
  _design?: boolean;
  _form?: true;
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
  MOBILE = 'mobile', // 移动端
  TABLET = 'tablet', // 平板
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

export enum IFormSubTypes {
  GRID = 'grid', // 网格布局
}

// 列表类型枚举
export enum IListSubTypes {
  TIMELINE = 'timeline', // 时间线
  TABLE = 'table', // 表格
  CANVAS = 'canvas', // 画布
  CALENDAR = 'calendar', // 日历
  DIRECTORY = 'directory', // 目录
}

// 详情类型接口
export interface IDetailSubType {
  GRID: 'grid'; // 网格布局
  CANVAS: 'canvas'; // 画布布局
}

// 列表配置接口
export interface IListConfig {
  type: IWidgetType; // 组件类型
  // 可根据需要添加更多通用列表配置字段
}

// 继承自列表配置的具体列表类型配置接口
export interface IListTimelineConfig extends IListConfig {
  // 时间线特定配置
  // 示例：时间线方向、时间格式等
  timelineDirection: 'left-to-right' | 'top-to-bottom';
  timeFormat: string;
}

export interface IListTableConfig extends IListConfig {
  // 表格特定配置
  // 示例：列配置、分页设置等
  columns: Array<{
    title: string;
    dataIndex: string;
    width: number;
  }>;
  pagination: {
    pageSize: number;
    current: number;
  };
}

export interface IListCanvasConfig extends IListConfig {
  // 画布特定配置
  // 示例：背景颜色、网格设置等
  backgroundColor: string;
  grid: {
    show: boolean;
    color: string;
    width: number;
  };
}

export interface IListCalendarConfig extends IListConfig {
  // 日历特定配置
  // 示例：视图模式、事件颜色等
  view: 'month' | 'week' | 'day';
  eventColors: Array<string>;
}

export interface IListDirectoryConfig extends IListConfig {
  // 目录特定配置
  // 示例：层级深度、排序方式等
  maxDepth: number;
  sort: 'asc' | 'desc';
}

// 编辑尺寸配置接口
export interface IEditSizeConfig {
  type: IEditSizeType; // 设备类型
  size: {
    width: number; // 宽度
    height: number; // 高度
  };
}

// 组件样式配置接口
export interface IWidgetStyleConfig {
  // 组件样式相关配置
  // 示例：背景颜色、边框、字体等
  backgroundColor: string;
  border: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
  };
  font: {
    family: string;
    size: number;
    color: string;
  };
}

// 数据源配置接口
export interface IDataSourceConfig {
  // 数据源相关配置
  // 示例：API 地址、请求方法、参数等
  api: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params: Record<string, any>;
}

// 事件配置接口
export interface IEventConfig {
  // 组件事件相关配置
  // 示例：点击事件、双击事件等
  onClick: string; // 点击事件处理函数或动作
  onDoubleClick: string; // 双击事件处理函数或动作
}

// 表单字段校验规则接口
export interface IFormRule {
  // 表单字段校验规则
  required: boolean; // 是否必填
  message: string; // 校验提示信息
  pattern?: RegExp; // 校验正则表达式
}

// 表单配置接口
export interface IFormConfig {
  // 表单特定配置
  // 示例：表单布局、字段配置等
  layout: 'horizontal' | 'vertical'; // 表单布局
  fields: Array<{
    name: string; // 字段名称
    label: string; // 字段标签
    type: string; // 字段类型（如输入框、下拉框等）
    rules: IFormRule[]; // 校验规则
  }>;
}

// 图表配置接口
export interface IChartConfig {
  // 图表特定配置
  // 示例：图表类型、数据映射等
  chartType: 'bar' | 'line' | 'pie' | 'radar'; // 图表类型
  dataMapping: {
    xField: string; // X 轴数据字段
    yField: string; // Y 轴数据字段
  };
}

// 组件配置接口
export interface WidgetConfig {
  id?: number; // 组件唯一标识
  title?: string; // 组件标题
  key?: string; // 组件键值
  type?: string; // 组件类型（表单、列表、详情、图表等）
  workSizeConfig?: IEditSizeConfig; // 工作区尺寸配置
  styleConfig?: IWidgetStyleConfig; // 组件样式配置
  dataSourceConfig?: IDataSourceConfig; // 数据源配置
  eventConfig?: IEventConfig; // 事件配置
  fieldConfig?:
    | {
        type: IWidgetType; // 组件类型
        subType: IFormSubTypes | IListSubTypes | IDetailSubType; // 具体类型
        listTimeLineConfig?: IListTimelineConfig; // 时间线列表配置
        listTableConfig?: IListTableConfig; // 表格列表配置
        listCanvasConfig?: IListCanvasConfig; // 画布列表配置
        listCalendarConfig?: IListCalendarConfig; // 日历列表配置
        listDirectoryConfig?: IListDirectoryConfig; // 目录列表配置
        formConfig?: IEditorFormlyField[]; // 表单配置
        chartConfig?: IChartConfig; // 图表配置
        // 可根据需要添加其他组件类型的具体配置
      }
    | string;
}
