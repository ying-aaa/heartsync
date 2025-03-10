// src/modules/form/entities/form-widget.entity.ts
import { Entity, Column } from 'typeorm';
import { HsBaseWidgetEntity } from '../base-widget.entity';

export enum IFormSubTypes {
  FLAT = 'flat', // 网格布局
  CANVAS = 'canvas', // 网格布局
}

export interface IEditorFormlyField {
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
  [key: string]: any;
}

export interface IFormStyle {}

export interface IFormCanvasTypeField {}

export interface IFormFlowConfig {}

export interface IFormLogicConfig {}

export interface IFormButtonConfig {}

@Entity()
export class HsFormWidget extends HsBaseWidgetEntity {
  @Column({ type: 'varchar', nullable: false })
  formName: string;

  @Column({ type: 'varchar', nullable: true })
  editName?: string;

  @Column({ type: 'simple-json', nullable: true })
  subType?: IFormSubTypes;

  @Column({ type: 'simple-json', nullable: true })
  formStyle?: IFormStyle;

  @Column({ type: 'simple-json', nullable: true, default: [] })
  flatTypeField: IEditorFormlyField;

  @Column({ type: 'simple-json', nullable: true })
  canvasTypeField?: IEditorFormlyField;

  @Column({ type: 'boolean', nullable: false, default: false })
  isUseFlow?: boolean;

  @Column({ type: 'simple-json', nullable: true })
  flowConfig?: IFormFlowConfig;

  @Column({ type: 'simple-json', nullable: true })
  logicConfig?: IFormLogicConfig;

  @Column({ type: 'simple-json', nullable: true })
  buttonConfig?: IFormButtonConfig;
}
