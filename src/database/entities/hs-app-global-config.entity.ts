import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  IAPP_LAYOUT_TYPES,
  IAppGlobalConfig,
  IAppLayoutType,
  ISoftDeleteStatus,
} from '@heartsync/types';

@Entity('hs_app_global_config', { comment: '应用全局配置表' })
@Index(['appId', 'versionId'], { unique: true })
export class HsAppGlobalConfigEntity implements IAppGlobalConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'app_id', type: 'varchar', length: 64, comment: '应用ID' })
  appId: string;

  @Column({
    name: 'version_id',
    type: 'varchar',
    length: 64,
    comment: '版本ID',
  })
  versionId: string;

  @Column({
    name: 'app_layout_type',
    type: 'varchar',
    length: 64,
    nullable: true,
    default: 'default',
    comment: '应用布局类型：default/left-right',
    enum: IAPP_LAYOUT_TYPES,
  })
  appLayoutType: IAppLayoutType;

  @Column({
    name: 'global_container_style',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => '\'{"backgroundImage":[]}\'',
    comment: '全局容器样式配置',
  })
  globalContainerStyle: {
    backgroundImage: Array<Record<string, string>>;
  };

  @Column({
    name: 'custom_app_global_css_text',
    type: 'text',
    nullable: true,
    comment: '自定义全局CSS文本',
  })
  customAppGlobalCssText: string;

  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @Column({
    name: 'is_deleted',
    type: 'smallint',
    default: 0,
    enum: ISoftDeleteStatus,
    comment: '软删除：0-未删 1-已删',
  })
  isDeleted: number;
}
