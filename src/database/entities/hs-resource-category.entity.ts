import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('hs_resource_categories', { comment: '系统资源分类表' })
export class HsResourceCategory {
  @PrimaryColumn()
  id: string;

  @Column()
  bucket: string;

  @Column()
  name: string;

  @Column({ default: false })
  is_default: boolean;

  @Column({ default: 0 })
  sort_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
