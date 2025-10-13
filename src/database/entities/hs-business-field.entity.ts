import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// 字段类型枚举（前端传递的类型，映射到数据库类型）
export enum IFieldType {
  STRING = 'string', // 字符串
  NUMBER = 'number', // 数字
  BOOLEAN = 'boolean', // 布尔值
  DATE = 'date', // 日期
  OBJECT = 'object', // 对象（JSON）
  TEXT = 'text', // 长文本
}

export interface IFieldStructure {
  formControlId: string;
  name: string;
  type: IFieldType;
  length?: number;
  isRequired?: boolean;
  isPrimaryKey?: boolean;
  comment?: string;
}

@Entity('hs_business_fields', { comment: '资产绑定业务字段' })
export class HsBusinessFieldEntity {
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
    name: 'table_id',
    type: 'varchar',
    length: 100,
    comment: '关联表id',
  })
  tableId: string;

  @Column({
    name: 'structures',
    type: 'simple-json',
    comment: '结构',
  })
  structures: IFieldStructure[];
}
