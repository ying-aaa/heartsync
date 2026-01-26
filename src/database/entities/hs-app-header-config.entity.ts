import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  IHeaderContentItem,
  IAppHeaderConfig,
  IWhetherStatus,
} from '@heartsync/types';
import { Exclude } from 'class-transformer';

@Entity('hs_app_header_config', { comment: '应用头部配置表' })
@Index(['appId', 'versionId'], { unique: true })
export class HsAppHeaderConfigEntity implements IAppHeaderConfig {
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
    name: 'header_container_style',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => "'{}'",
    comment: '头部容器样式',
  })
  headerContainerStyle: Record<string, string>;

  // 关联你的IHeaderContentItem类型
  @Column({
    name: 'header_content_items',
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: true,
    default: () => "'[]'",
    comment: '头部内容项',
  })
  headerContentItems: IHeaderContentItem[];

  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @Exclude()
  @Column({
    name: 'is_deleted',
    type: 'smallint',
    default: 0,
    enum: IWhetherStatus,
    comment: '软删除：0-未删 1-已删',
  })
  isDeleted: IWhetherStatus;
}
