import { Column, Entity } from 'typeorm';
import { HsBaseEntity } from 'src/database/entities/hs-base.entity';
import {
  IEditorFormlyField,
  IFormButtonConfig,
  IFormWidgetConfig,
  IFormWidgetSubTypes,
  IWhetherStatus,
  IWidgetSettings,
  IWidgetType,
} from '@heartsync/types';

@Entity('hs_form_widget', { comment: '表单部件表' })
export class HsFormWidgetEntity
  extends HsBaseEntity
  implements IFormWidgetConfig
{
  @Column({ name: 'name', type: 'varchar', nullable: false, comment: '名称' })
  name: string;

  @Column({ name: 'app_id', type: 'varchar', length: 64, comment: '应用ID' })
  appId: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: IWidgetType,
    nullable: false,
    comment: '部件类型',
  })
  type: IWidgetType;

  @Column({
    name: 'sub_type',
    type: 'varchar',
    nullable: true,
    default: IFormWidgetSubTypes.FLAT,
    comment: '表单类型',
  })
  subType: IFormWidgetSubTypes;

  @Column({
    name: 'settings',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    comment: '部件设置',
    default: () => "'{}'",
  })
  settings: IWidgetSettings;

  @Column({
    name: 'flat_type_field',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => "'[]'",
    comment: '表单字段',
  })
  flatTypeField: IEditorFormlyField[];

  @Column({
    name: 'canvas_type_field',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => "'[]'",
    comment: '表单字段',
  })
  canvasTypeField?: any[];

  @Column({
    name: 'use_flow',
    type: 'boolean',
    nullable: false,
    default: false,
    comment: '是否使用流程',
  })
  useFlow?: IWhetherStatus;

  @Column({
    name: 'button_config',
    type: 'simple-json',
    nullable: true,
    comment: '表单按钮',
  })
  buttonConfig?: IFormButtonConfig;
}
