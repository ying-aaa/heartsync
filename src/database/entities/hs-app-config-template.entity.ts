import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IAPP_TEMPLATE_TYPES,
  IAppGlobalConfig,
  IAppHeaderConfig,
  IAppMenuConfig,
  IAppTemplateType,
  IWhetherStatus,
} from '@heartsync/types';

@Entity('hs_app_config_template', { comment: '应用配置模板表' })
export class HsAppConfigTemplate {
  @PrimaryGeneratedColumn('uuid', { comment: '模板主键ID' })
  id: string;

  @Column({
    name: 'template_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '模板名称',
  })
  templateName: string;

  @Column({
    name: 'template_type',
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'system',
    comment: '模板类型：system-系统内置，user-用户自定义',
    enum: IAPP_TEMPLATE_TYPES,
  })
  templateType: IAppTemplateType;

  @Column({
    name: 'app_id',
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: '关联应用ID（null=全局模板）',
  })
  appId?: string;

  @Column({
    name: 'creator_id',
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: '创建人ID（系统内置填system）',
  })
  creatorId: string;

  @Column({
    name: 'is_default',
    type: 'smallint',
    nullable: false,
    default: 0,
    enum: IWhetherStatus,
    comment: '是否默认模板：0-否，1-是',
  })
  isDefault: IWhetherStatus;

  @Column({
    name: 'remark',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '模板备注',
  })
  remark?: string;

  @Column({
    name: 'app_global_config',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => "'{}'",
    comment: '应用全局配置',
  })
  appGlobalConfig: Partial<IAppGlobalConfig>;

  @Column({
    name: 'app_header_config',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => "'{}'",
    comment: '应用头部配置',
  })
  appHeaderConfig: Partial<IAppHeaderConfig>;

  @Column({
    name: 'app_menu_config',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => "'{}'",
    comment: '应用菜单配置',
  })
  appMenuConfig: Partial<IAppMenuConfig>;

  /** 创建时间 */
  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;

  /** 更新时间 */
  @UpdateDateColumn({ name: 'update_time', comment: '更新时间' })
  updateTime: Date;
}
