import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

// 关联类型枚举
export enum RelationType {
  ONE_TO_MANY = 'one2many', // 一对多（如用户→订单）
  MANY_TO_ONE = 'many2one', // 多对一（如订单→用户）
  MANY_TO_MANY = 'many2many', // 多对多（如学生→课程）
}

@Entity('hs_asset_relations', { comment: '资产关联关系' })
@Unique(['parentTableId', 'parentField', 'childTableId', 'childField']) // 避免重复关联
export class HsAssetRelationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'business_id',
    type: 'varchar',
    length: 100,
    comment: '业务场景id',
  })
  businessId: string;

  @Column({
    name: 'parent_table_id',
    type: 'varchar',
    length: 100,
    comment: '父表ID',
  })
  parentTableId: string;

  @Column({
    name: 'parent_field',
    type: 'varchar',
    length: 100,
    comment: '父表关联字段',
  })
  parentField: string;

  @Column({
    name: 'child_table_id',
    type: 'varchar',
    length: 100,
    comment: '子表id',
  })
  childTableId: string;

  @Column({
    name: 'child_field',
    type: 'varchar',
    length: 100,
    comment: '子表关联字段',
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
    type: 'varchar',
    nullable: true,
    comment: '关联描述（如“用户-订单：一对多”）',
  })
  comment?: string;
}
