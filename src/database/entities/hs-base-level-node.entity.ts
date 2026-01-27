import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IAllowChildren,
  IDocumentNodeType,
  ILevelNode,
} from '@heartsync/types';

@Entity('hs_document')
export abstract class HsLevelNode implements ILevelNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: true,
    default: null,
    name: 'parent_id',
    comment: '父节点ID（根节点为null）',
  })
  parentId: string;

  @Column({
    type: 'int',
    name: 'sort_value',
    comment: '排序值',
  })
  sort: number;

  @Column({
    type: 'int',
    name: 'level',
    comment: '层级',
  })
  level: number;

  @Column({
    type: 'int',
    name: 'node_type',
    comment: '节点类型：0=纯目录（不可点击），1=业务节点（可点击）',
    default: IDocumentNodeType.BUSINESS,
  })
  nodeType: number;

  @Column({
    type: 'int',
    name: 'allow_children',
    comment: '可选：是否允许有子节点（0=否，1=是）',
    default: IAllowChildren.YES,
  })
  allowChildren: number;
}
