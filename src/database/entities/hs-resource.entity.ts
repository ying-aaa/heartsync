import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('hs_resources', { comment: '系统资源表' })
export class HsResource {
  @PrimaryColumn()
  id: string;

  @Column()
  bucket: string;

  @Column()
  url: string;

  @Column()
  path: string;

  @Column()
  category_id: string;

  @Column()
  original_name: string;

  @Column('bigint')
  size: number;

  @Column({ nullable: true })
  mime_type: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ default: 'public' })
  access_type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_default: boolean;

  constructor() {
    this.id = uuidv4();
  }
}
