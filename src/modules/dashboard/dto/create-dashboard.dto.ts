import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { IDashboardGridsterConfig, IDashboardType } from '@heartsync/types';
import { GridsterConfigDto } from './gridster-config.dto';

/**
 * 仪表板创建DTO - 新增仪表板接口入参
 */
export class CreateDashboardDto {
  /**
   * 仪表板节点ID（可选，默认空字符串）
   */
  @IsNotEmpty({ message: '节点id不能为空' })
  @IsString({ message: '节点id必须为字符串' })
  nodeId: string;

  /**
   * 仪表板名称（必传，非空）
   */
  @IsString({ message: '仪表板名称必须为字符串' })
  @IsNotEmpty({ message: '仪表板名称不能为空' })
  name: string;

  /**
   * 仪表板类型（必传，枚举值）
   * 默认值：IDashboardType.GRIDSTER（与实体一致）
   */
  @IsEnum(IDashboardType, {
    message: `仪表板类型必须为${Object.values(IDashboardType).join('/')}`,
  })
  type: IDashboardType = IDashboardType.GRIDSTER;

  /**
   * 关联的应用ID（必传，非空）
   */
  @IsString({ message: '关联应用ID必须为字符串' })
  @IsNotEmpty({ message: '关联应用ID不能为空' })
  appId: string;

  /**
   * 仪表板描述（可选，默认空字符串）
   */
  @IsOptional()
  @IsString({ message: '描述必须为字符串' })
  description: string = '';

  /**
   * 仪表板配置（可选，默认空对象）
   */
  @IsOptional()
  @Type(() => GridsterConfigDto)
  @IsObject({ message: '配置必须为对象' })
  gridsterConfig: IDashboardGridsterConfig = {
    gridsterOption: {},
    gridsterWidgets: [],
  };
}
