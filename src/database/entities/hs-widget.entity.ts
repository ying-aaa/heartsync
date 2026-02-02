import { HsBaseEntity } from 'src/database/entities/hs-base.entity';
import { Entity, Column, BeforeUpdate } from 'typeorm';
import { IWidgetType } from '@heartsync/types';

@Entity('hs_widget', { comment: '部件表' })
export class HsWidgetEntity extends HsBaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: IWidgetType,
    default: IWidgetType.CODE,
  })
  type: IWidgetType;

  @Column({ type: 'varchar', name: 'app_id' })
  appId: string;

  @Column({ type: 'varchar', name: 'parent_id', nullable: true })
  parentId: string;

  @Column({
    type: 'jsonb',
    name: 'general_config',
    nullable: true,
    default: {},
  })
  generalConfig: Record<string, any>;

  @Column({ name: 'is_template', default: false })
  isTemplate: boolean;

  @Column({ default: 1 })
  version: number;

  @BeforeUpdate()
  updateVersion() {
    this.version += 1;
  }
}
