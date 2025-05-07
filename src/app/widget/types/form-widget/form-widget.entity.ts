// src/modules/form/entities/form-widget.entity.ts
import { Column, Entity } from 'typeorm';
import { HsBaseEntity } from 'src/common/entities/base.entity';

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
export class HsFormWidget extends HsBaseEntity {
  @Column({ name: 'widget_id', type: 'varchar', nullable: false })
  widgetId: string;

  @Column({ name: 'form_name', type: 'varchar', nullable: false })
  formName: string;

  @Column({ name: 'edit_name', type: 'varchar', nullable: true })
  editName?: string;

  @Column({
    name: 'sub_type',
    type: 'varchar',
    nullable: true,
    default: IFormSubTypes.FLAT,
  })
  subType?: IFormSubTypes;

  @Column({ name: 'form_style', type: 'simple-json', nullable: true })
  formStyle?: IFormStyle;

  @Column({
    name: 'flat_type_field',
    type: 'simple-json',
    nullable: true,
    default: [],
  })
  flatTypeField: IEditorFormlyField;

  @Column({ name: 'canvas_type_field', type: 'simple-json', nullable: true })
  canvasTypeField?: IEditorFormlyField;

  @Column({
    name: 'is_use_flow',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isUseFlow?: boolean;

  @Column({ name: 'flow_config', type: 'simple-json', nullable: true })
  flowConfig?: IFormFlowConfig;

  @Column({ name: 'logic_config', type: 'simple-json', nullable: true })
  logicConfig?: IFormLogicConfig;

  @Column({ name: 'button_config', type: 'simple-json', nullable: true })
  buttonConfig?: IFormButtonConfig;
}
