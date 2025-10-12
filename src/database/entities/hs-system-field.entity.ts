// src/modules/schema/entities/system-field.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { HsSystemTableEntity } from './hs-system-table.entity';

// 字段类型枚举（前端传递的类型，映射到数据库类型）
export enum FieldType {
  STRING = 'string', // 字符串
  NUMBER = 'number', // 数字
  BOOLEAN = 'boolean', // 布尔值
  DATE = 'date', // 日期
  OBJECT = 'object', // 对象（JSON）
  TEXT = 'text', // 长文本
}

@Entity('system_fields', { comment: '字段元数据' })
@Unique(['table', 'fieldName']) // 同一表中字段名唯一
export class HsSystemFieldEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 字段唯一ID

  @ManyToOne(() => HsSystemTableEntity, (table) => table.fields, {
    onDelete: 'CASCADE', // 表元数据删除时，字段也删除
    nullable: false,
  })
  table: HsSystemTableEntity; // 关联表（多对一：多个字段属于一张表）

  @Column({
    name: 'field_name',
    length: 100,
    comment: '字段名（数据库中实际的字段名）',
  })
  fieldName: string;

  @Column({
    name: 'field_type',
    type: 'enum',
    enum: FieldType,
    comment: '字段类型（前端定义的类型）',
  })
  fieldType: FieldType;

  @Column({
    type: 'int',
    nullable: true,
    comment: '字段长度（如varchar(255)的255）',
  })
  length?: number;

  @Column({
    name: 'is_required',
    default: false,
    comment: '是否必填',
  })
  isRequired: boolean;

  @Column({
    name: 'default_value',
    type: 'text',
    nullable: true,
    comment: '默认值（JSON字符串存储）',
  })
  defaultValue?: string;

  @Column({
    name: 'is_primary',
    default: false,
    comment: '是否主键（通常自动生成，用户可指定）',
  })
  isPrimary: boolean;

  @Column({
    name: 'is_deleted',
    default: false,
    comment: '是否逻辑删除',
  })
  isDeleted: boolean;
}
