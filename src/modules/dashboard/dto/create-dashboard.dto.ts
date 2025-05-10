// create-dashboard.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  ValidateNested,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DashboardType } from 'src/database/entities/hs-dashboard.entity';

// 公共基础DTO
class BaseDashboardDto {
  @ApiProperty({ description: '仪表板标题' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, description: '仪表板描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: Object, description: '网格配置' })
  @IsObject()
  @IsOptional()
  gridsterOption: Record<string, any>;

  @ApiProperty({ type: Object, description: '布局配置' })
  @IsObject()
  @IsOptional()
  layoutConfig: Record<string, any>;

  @ApiProperty({ type: [Object], description: '部件列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WidgetsDto)
  @IsOptional()
  widgets: WidgetsDto[];

  @ApiProperty({ required: false, type: Object, description: '数据源配置' })
  @IsObject()
  @IsOptional()
  dataSources?: Record<string, any>;

  @ApiProperty({ required: false, type: Object, description: '访问控制配置' })
  @IsObject()
  @IsOptional()
  accessControl?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  appId: string;
}

// 创建DTO
export class CreateDashboardDto extends BaseDashboardDto {
  @ApiProperty({ required: false, default: true, description: '是否启用' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsString()
  @IsOptional()
  nodeId: string;

  @IsEnum(DashboardType)
  @IsOptional()
  type: DashboardType;
}

// 更新DTO
export class UpdateDashboardDto extends BaseDashboardDto {
  @ApiProperty({ description: '版本号' })
  @IsInt()
  @Min(1)
  version: number;

  @ApiProperty({ required: false, description: '是否启用' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

// 部件DTO
export class WidgetsDto {
  @ApiProperty({ description: '部件实例ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '部件定义ID' })
  @IsString()
  widget_id: string;

  @ApiProperty({ description: '部件标题' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: '部件描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: ['form', 'list', 'custom', 'cesium', 'detail'],
    description: '部件类型',
  })
  @IsIn(['form', 'list', 'custom', 'cesium', 'detail'])
  type: 'form' | 'list' | 'custom' | 'cesium' | 'detail';

  @ApiProperty({ type: Object, required: false, description: '部件配置' })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>;

  @ApiProperty({ description: '部件预览图URL' })
  @IsString()
  image: string;

  @ApiProperty({ description: '占位列数' })
  @IsInt()
  @Min(1)
  cols: number;

  @ApiProperty({ description: '占位行数' })
  @IsInt()
  @Min(1)
  rows: number;

  @ApiProperty({ description: 'X轴位置' })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Y轴位置' })
  @IsNumber()
  y: number;

  @ApiProperty({ description: '层级索引' })
  @IsInt()
  layerIndex: number;

  // @ApiProperty({ description: '最大行数' })
  // @IsInt()
  // maxItemRows: number;

  // @ApiProperty({ description: '最大列数' })
  // @IsInt()
  // maxItemCols: number;

  // @ApiProperty({ description: '最小行数' })
  // @IsInt()
  // minItemRows: number;

  // @ApiProperty({ description: '最小列数' })
  // @IsInt()
  // minItemCols: number;
}
