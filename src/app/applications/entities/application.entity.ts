import { HsBaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class HsApplication extends HsBaseEntity {
  @Column()
  directoryId: string;

  @Column()
  name: string;

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
