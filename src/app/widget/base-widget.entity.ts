// src/common/entities/base-widget.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum IWidgetType {
  CODE = 'code', // 代码组件
  CHART = 'chart', // 图表组件
  CESIUM = 'cesium', // Cesium 3D 地图组件
  X6 = 'x6', // 流程图组件
  FORM = 'form', // 表单组件
  LIST = 'list', // 列表组件
  DETAIL = 'detail', // 详情组件
}

export enum IEditSizeType {
  MOBILE = 'mobile', // 移动端
  TABLET = 'ipad', // 平板
  PC = 'pc', // 电脑端
  CUSTOM = 'custom', // 自定义
}

export interface IEditSizeConfig {
  type: IEditSizeType; // 设备类型
  size: {
    width: number; // 宽度
    height: number; // 高度
  };
}

// 组件样式配置接口
export interface IWidgetStyleConfig {}

// 数据源配置接口
export interface IDataSourceConfig {}

// 部件变量
export interface IFormVariablesConfig {}

@Entity()
export class HsBaseWidgetEntity {
  @PrimaryGeneratedColumn()
  id: number; // 组件唯一标识

  @Column({ type: 'varchar', nullable: true })
  appId?: string;

  @Column({ type: 'varchar', nullable: true })
  dashboardId?: string;

  @Column({ type: 'varchar', nullable: false })
  workspaceName: string; // 工作台名称

  @Column({ type: 'varchar', nullable: true })
  type?: IWidgetType; // 组件类型（表单、列表、详情、图表等）

  @Column({ type: 'simple-json', nullable: true })
  workSizeConfig?: IEditSizeConfig; // 工作区尺寸配置

  @Column({ type: 'simple-json', nullable: true })
  styleConfig?: IWidgetStyleConfig; // 组件样式配置

  @Column({ type: 'simple-json', nullable: true })
  dataSourceConfig?: IDataSourceConfig; // 数据源配置

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime?: Date;

  @Column({ type: 'varchar', nullable: true })
  createUser?: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  lastUpdateTime?: Date;

  @Column({ type: 'varchar', nullable: true })
  lastUpdateUser?: string;

  @Column({ type: 'simple-json', nullable: true })
  variablesConfig?: IFormVariablesConfig;
}
