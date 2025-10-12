// src/modules/schema/entities/system-relation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { HsSystemTableEntity } from './hs-system-table.entity';

// 关联类型枚举
export enum RelationType {
  ONE_TO_MANY = 'one2many', // 一对多（如用户→订单）
  MANY_TO_ONE = 'many2one', // 多对一（如订单→用户）
  MANY_TO_MANY = 'many2many', // 多对多（如学生→课程）
}

@Entity('system_relations', { comment: '表关联关系元数据' })
@Unique(['parentTable', 'parentField', 'childTable', 'childField']) // 避免重复关联
export class HsSystemRelationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 关联关系唯一ID

  @ManyToOne(() => HsSystemTableEntity, (table) => table.parentRelations, {
    onDelete: 'CASCADE', // 父表删除，关联关系删除
    nullable: false,
  })
  parentTable: HsSystemTableEntity; // 父表（如用户表）

  @Column({
    name: 'parent_field',
    length: 100,
    comment: '父表关联字段（如user.id）',
  })
  parentField: string;

  @ManyToOne(() => HsSystemTableEntity, (table) => table.childRelations, {
    onDelete: 'CASCADE', // 子表删除，关联关系删除
    nullable: false,
  })
  childTable: HsSystemTableEntity; // 子表（如订单表）

  @Column({
    name: 'child_field',
    length: 100,
    comment: '子表关联字段（如order.user_id）',
  })
  childField: string;

  @Column({
    name: 'relation_type',
    type: 'enum',
    enum: RelationType,
    comment: '关联类型',
  })
  relationType: RelationType;

  @Column({
    length: 255,
    nullable: true,
    comment: '关联描述（如“用户-订单：一对多”）',
  })
  comment?: string;
}
