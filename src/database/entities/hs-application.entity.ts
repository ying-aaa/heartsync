import { HsBaseEntity } from 'src/database/entities/hs-base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ISoftDeleteStatus } from '@heartsync/types';
import { HsAppVersionEntity } from './hs-app-version.entity';
import { Exclude } from 'class-transformer';

@Entity('hs_application', { comment: '系统应用表' })
export class HsApplicationEntity extends HsBaseEntity {
  @Column({
    name: 'directory_id',
    type: 'varchar',
    length: 64,
    comment: '所属目录ID',
    default: 'system',
  })
  directoryId: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 64,
    comment: '应用名称',
  })
  name: string;

  @Column({ name: 'type', nullable: true, default: 'web', comment: '应用类型' })
  type: string;

  @Column({
    name: 'image_url',
    nullable: true,
    default: '',
    comment: '应用描述',
  })
  imageUrl: string;

  @Column({
    name: 'description',
    nullable: true,
    default: '',
    comment: '应用描述',
  })
  description: string;

  @OneToMany(() => HsAppVersionEntity, (version) => version.app)
  versions: HsAppVersionEntity[];

  @Column('jsonb', { nullable: true })
  tags: any;

  @Exclude()
  @Column({
    name: 'is_deleted',
    type: 'smallint',
    default: 0,
    enum: ISoftDeleteStatus,
    comment: '软删除：0-未删 1-已删',
  })
  isDeleted: ISoftDeleteStatus;
}
