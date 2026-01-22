import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { HsApplicationEntity } from './hs-application.entity';
import { IAppVersionStatus } from '@heartsync/types';

@Entity('hs_app_version', { comment: '应用版本表' })
@Index(['appId', 'versionCode'], { unique: true })
export class HsAppVersionEntity {
  /** 主键ID */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 应用ID */
  @Column({
    name: 'app_id',
    type: 'varchar',
    length: 64,
    comment: '应用ID',
  })
  appId: string;

  /** 关联应用实体 */
  @ManyToOne(() => HsApplicationEntity, (app) => app.versions)
  @JoinColumn({ name: 'app_id' })
  app: HsApplicationEntity;

  /** 版本号 */
  @Column({
    name: 'version_code',
    type: 'varchar',
    length: 32,
    default: 'V1.0.0',
    comment: '版本号',
  })
  versionCode: string;

  /** 版本名称 */
  @Column({
    name: 'version_name',
    type: 'varchar',
    length: 128,
    default: '初始版本',
    comment: '版本名称',
  })
  versionName: string;

  /** 版本描述 */
  @Column({
    name: 'version_desc',
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: '版本描述',
  })
  versionDesc: string;

  /** 版本状态 */
  @Column({
    name: 'status',
    type: 'smallint',
    default: IAppVersionStatus.DRAFT,
    enum: IAppVersionStatus,
    comment: '版本状态：0-草稿 1-待发布 2-已发布 3-已回滚',
  })
  status: IAppVersionStatus;

  /** 发布时间 */
  @Column({
    name: 'publish_time',
    type: 'timestamp',
    nullable: true,
    comment: '发布时间',
  })
  publishTime: Date;

  /** 发布人ID */
  @Column({
    name: 'publish_user_id',
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: '发布人ID',
  })
  publishUserId: string;

  /** 创建时间 */
  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;
}
