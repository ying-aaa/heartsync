import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NodeType {
  FILE = 'file',
  FOLDER = 'folder',
}

@Entity()
export class HsFileNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  businessId: string;

  @Column({ nullable: true })
  parentId: number;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: NodeType,
    default: NodeType.FILE,
  })
  type: NodeType;

  @Column({ default: false, name: 'has_children' })
  hasChildren: boolean;

  @Column('jsonb', { nullable: true })
  meta: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
