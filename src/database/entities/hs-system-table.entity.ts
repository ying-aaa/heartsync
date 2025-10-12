// src/modules/schema/entities/system-table.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { HsDataSourceEntity } from './hs-data-source.entity';
import { HsSystemFieldEntity } from './hs-system-field.entity';
import { HsSystemRelationEntity } from './hs-system-relation.entity';

@Entity('system_tables', { comment: '表结构元数据' })
export class HsSystemTableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 表唯一ID（元数据ID，非业务表主键）

  @ManyToOne(() => HsDataSourceEntity, (dataSource) => dataSource.id, {
    onDelete: 'CASCADE', // 数据源删除时，关联的表元数据也删除
    nullable: false,
  })
  dataSource: HsDataSourceEntity; // 关联数据源（多对一：多个表属于一个数据源）

  @Column({
    name: 'table_name',
    length: 100,
    comment: '业务表名（数据库中实际的表名）',
  })
  tableName: string;

  @Column({
    length: 255,
    nullable: true,
    comment: '表描述',
  })
  comment?: string;

  @Column({
    name: 'is_deleted',
    default: false,
    comment: '是否逻辑删除',
  })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  // 关联字段：一张表包含多个字段（一对多）
  @OneToMany(() => HsSystemFieldEntity, (field) => field.table, {
    cascade: true,
  })
  fields: HsSystemFieldEntity[];

  // 关联关系：一张表可作为父表关联多个子表
  @OneToMany(() => HsSystemRelationEntity, (relation) => relation.parentTable)
  parentRelations: HsSystemRelationEntity[];

  // 关联关系：一张表可作为子表被多个父表关联
  @OneToMany(() => HsSystemRelationEntity, (relation) => relation.childTable)
  childRelations: HsSystemRelationEntity[];
}
