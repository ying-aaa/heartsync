import { IBaseWidgetConfig, IEditorFormlyField } from './widget.model';

export enum IFormSubTypes {
  FLAT = 'flat', // 网格布局
  CANVAS = 'canvas', // 网格布局
}

export interface IFormStyle {}

export interface IFormCanvasTypeField {}

export interface IFormFlowConfig {}

export interface IFormLogicConfig {}

export interface IFormButtonConfig {}

export interface IFormWidgetConfig extends IBaseWidgetConfig {
  formName: string;
  editName?: string;
  subType: IFormSubTypes;
  formStyle?: IFormStyle;
  flatTypeField?: IEditorFormlyField[];
  canvasTypeField?: IEditorFormlyField;
  isUseFlow?: boolean;
  flowConfig?: IFormFlowConfig;
  logicConfig?: IFormLogicConfig;
  buttonConfig?: IFormButtonConfig;
}
