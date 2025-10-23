import { Entity, Column } from 'typeorm';
import { HsBaseEntity } from './hs-base.entity';

export enum DashboardType {
  GRIDSTER = 'gridster',
}

@Entity('hs_dashboard', { comment: '仪表盘表' })
export class HsDashboardEntity extends HsBaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: DashboardType,
    default: DashboardType.GRIDSTER,
  })
  type: DashboardType;

  @Column({ type: 'varchar', name: 'app_id' })
  appId: string;

  @Column('varchar', { nullable: true })
  description?: string;

  @Column('json', { name: 'gridster_option', default: {} })
  gridsterOption?: Record<string, any>;

  @Column('json', { name: 'layout_config', default: {} })
  layoutConfig: Record<string, any>;

  @Column('jsonb', { default: [] })
  widgets: Widgets[];

  @Column('jsonb', { name: 'data_sources', nullable: true, default: {} })
  dataSources?: Record<string, any>;

  @Column('jsonb', { name: 'accessControl', nullable: true, default: {} })
  access_control?: Record<string, any>;

  @Column({ default: 1 })
  version: number;
}

export class Widgets {
  id: string;
  widget_id: string;
  name: string;
  description: string;
  type: 'form' | 'list' | 'custom' | 'cesium' | 'detail';
  config?: Record<string, any>;
  image: string;
  cols: number;
  rows: number;
  x: number;
  y: number;
  layerIndex: number;
}
