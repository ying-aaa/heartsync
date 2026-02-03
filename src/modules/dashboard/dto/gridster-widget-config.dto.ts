import {
  IsString,
  IsNumber,
  IsObject,
  IsOptional,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { IWhetherStatus, IWidgetType } from '@heartsync/types';

export class GridsterWidgetConfigDto {
  /**
   * 部件唯一标识（必传，非空字符串）
   */
  @IsString({ message: '部件ID必须为字符串' })
  @IsNotEmpty({ message: '部件ID不能为空' })
  id: string;

  /**
   * 关联的基础部件类型（必传，枚举值）
   */
  @IsEnum(IWidgetType, {
    message: `部件类型必须为${Object.values(IWidgetType).join('/')}`,
  })
  type: IWidgetType;

  /**
   * 部件在栅格中的x坐标（必传，数字）
   */
  @IsNumber({}, { message: '部件x坐标必须为数字' })
  x: number;

  /**
   * 部件在栅格中的y坐标（必传，数字）
   */
  @IsNumber({}, { message: '部件y坐标必须为数字' })
  y: number;

  /**
   * 部件宽度（必传，数字）
   */
  @IsNumber({}, { message: '部件宽度必须为数字' })
  cols: number;

  /**
   * 部件高度（必传，数字）
   */
  @IsNumber({}, { message: '部件高度必须为数字' })
  rows: number;

  /**
   * 部件自定义配置（可选，对象）
   */
  @IsOptional()
  @IsObject({ message: '部件自定义配置必须为对象' })
  config?: Record<string, any>;

  /**
   * 部件名称（可选，字符串）
   */
  @IsOptional()
  @IsString({ message: '部件名称必须为字符串' })
  name?: string;

  /**
   * 部件是否是新创建的（可选，枚举值）
   */
  @IsOptional()
  @IsEnum(IWhetherStatus, {
    message: `部件是否是新创建的必须为${Object.values(IWhetherStatus).join('/')}`,
  })
  isNew?: IWhetherStatus;
}
