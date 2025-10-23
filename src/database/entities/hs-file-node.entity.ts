import { HsBaseEntity } from 'src/database/entities/hs-base.entity';
import { Entity, Column } from 'typeorm';

export enum NodeType {
  FILE = 'file',
  FOLDER = 'folder',
}

@Entity('hs_file_node', { comment: '文件节点表' })
export class HsFileNodeEntity extends HsBaseEntity {
  @Column({ length: 50 })
  businessId: string;

  @Column({ type: 'varchar', nullable: true })
  businessKey?: string;

  @Column({ nullable: true })
  parentId: string;

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
}
