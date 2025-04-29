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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @Column({ type: 'varchar', nullable: true })
  createdByDepartment: string;

  constructor() {
    this.id = uuidv4(); // 自动生成 UUID
  }
}
