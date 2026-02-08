import { Entity, Column } from 'typeorm';
import { HsBaseEntity } from './hs-base.entity';
import {
  IDashboardEntity,
  IDashboardType,
  IDashboardWidgetConfig,
} from '@heartsync/types';

@Entity('hs_dashboard', { comment: '仪表板表' })
export class HsDashboardEntity
  extends HsBaseEntity
  implements IDashboardEntity
{
  @Column({
    type: 'varchar',
    length: 255,
    comment: '仪表板名称',
  })
  name: string;

  @Column({
    type: 'enum',
    name: 'type',
    enum: IDashboardType,
    default: IDashboardType.GRIDSTER,
    comment: '仪表板类型',
  })
  type: IDashboardType;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'app_id',
    comment: '关联的应用ID',
  })
  appId: string;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: '描述',
    default: '',
  })
  description: string = '';

  @Column({
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'json',
    nullable: false,
    comment: 'gridster配置',
    default: () => `'{"gridsterOption":{},"gridsterWidgets":[]}'`,
  })
  gridsterConfig: {
    gridsterOption: any;
    gridsterWidgets: IDashboardWidgetConfig[];
  };
}
