import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// 字段类型枚举（前端传递的类型，映射到数据库类型）
export enum IFieldType {
  STRING = 'string', // 字符串
  NUMBER = 'number', // 数字
  BOOLEAN = 'boolean', // 布尔值
  DATE = 'date', // 日期
  OBJECT = 'object', // 对象（JSON）
  TEXT = 'text', // 长文本
}

@Entity('hs_asset_fields', { comment: '库表和资产关联字段' })
export class HsAssetFieldEntity {
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
    name: 'asset_id',
    type: 'varchar',
    length: 100,
    comment: '资产ID（关联资产）',
  })
  assetId: string;

  @Column({
    name: 'table_name',
    type: 'varchar',
    length: 100,
    comment: '绑定的数据库表名',
  })
  tableName: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    comment: '数据库表中的字段名',
  })
  name: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 50,
    comment: '数据库字段类型',
  })
  type: string;

  @Column({
    name: 'text_type',
    type: 'varchar',
    length: 50,
    comment: '字段文本类型',
  })
  textType: string;

  @Column({
    name: 'length',
    type: 'int',
    nullable: true,
    comment: '字段长度（如字符串长度、数字精度）',
  })
  length?: number;

  @Column({
    name: 'not_null',
    type: 'boolean',
    default: false,
    comment: '是否不能为空',
  })
  notNull: boolean;

  @Column({
    name: 'comment',
    type: 'text',
    nullable: true,
    comment: '字段业务描述',
  })
  comment?: string;

  @Column({
    name: 'is_primary_key',
    type: 'boolean',
    default: false,
    comment: '是否主键',
  })
  isPrimaryKey: boolean;

  @Column({
    name: 'is_show',
    type: 'boolean',
    default: true,
    comment: '是否在业务界面显示',
  })
  isShow: boolean;

  @Column({
    name: 'sort',
    type: 'int',
    default: 100,
    comment: '显示排序权重（值越小越靠前）',
  })
  sort: number;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    default: false,
    comment: '是否逻辑删除',
  })
  isDeleted: boolean;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
