import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

export abstract class HsBaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updatedAt: Date;

  @Column({
    name: 'created_by',
    type: 'varchar',
    nullable: true,
    comment: '创建人',
  })
  createdBy: string;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    nullable: true,
    comment: '更新人',
  })
  updatedBy: string;

  @Column({
    name: 'by_department',
    type: 'varchar',
    nullable: true,
    comment: '创建人所属部门',
  })
  byDepartment: string;

  constructor() {
    this.id = uuidv4(); // 自动生成 UUID
  }
}
