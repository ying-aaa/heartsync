import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('hs_asset_tables', { comment: '系统存入的数据库表' })
@Unique(['appId', 'name'])
export class HsAssetTableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'data_source_id',
    type: 'varchar',
    length: 100,
    comment: '数据源ID（关联数据库连接）',
  })
  dataSourceId: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    comment: '表名别名（系统展示的表名）',
  })
  name: string;

  @Column({
    name: 'app_id',
    type: 'varchar',
    nullable: true,
    length: 100,
    default: 'system',
    comment: '应用ID',
  })
  appId?: string;

  @Column({
    name: 'table_name',
    type: 'varchar',
    length: 100,
    comment: '表名',
  })
  tableName: string;

  @Column({
    length: 255,
    type: 'varchar',
    nullable: true,
    comment: '表描述',
  })
  comment?: string;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    nullable: true,
    default: false,
    comment: '是否逻辑删除',
  })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
