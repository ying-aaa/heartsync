import { HsBaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, BeforeUpdate } from 'typeorm';

export enum WidgetType {
  CODE = 'code',
  CHART = 'chart',
  CESIUM = 'cesium',
  X6 = 'x6',
  FORM = 'form',
  LIST = 'list',
  DETAIL = 'detail',
}

@Entity()
export class HsWidget extends HsBaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: WidgetType,
    default: WidgetType.CODE,
  })
  type: WidgetType;

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
