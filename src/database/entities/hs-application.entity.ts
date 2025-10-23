import { HsBaseEntity } from 'src/database/entities/hs-base.entity';
import { Entity, Column } from 'typeorm';

@Entity('hs_applications', { comment: '系统应用表' })
export class HsApplicationEntity extends HsBaseEntity {
  @Column()
  directoryId: string;

  @Column()
  name: string;

  @Column({ nullable: true, default: 'web' })
  type: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  version: string;

  @Column({ default: 'active' })
  status: string;

  @Column('jsonb', { nullable: true })
  tags: any;
}
