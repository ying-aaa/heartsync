import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
} from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';
import { IAppVersionStatus } from '@heartsync/types';
import { Transform } from 'class-transformer';
export class QueryApplicationDto extends PageOptionsDto {
  /** 应用名称（模糊查询用） */
  @IsString()
  @IsOptional()
  name?: string;

  /** 目录ID */
  @IsString()
  @IsOptional()
  directoryId?: string;

  /** 应用标签（JSONB类型筛选） */
  @IsObject()
  @IsOptional()
  tags?: Record<string, any>;

  /** 指定版本ID（精准筛选该版本的应用） */
  @IsString()
  @IsOptional()
  versionCode?: string;

  @Transform(({ value }) => {
    if (value === undefined || value === null) return value;
    const numValue = Number(value);
    return isNaN(numValue) ? value : numValue;
  })
  @IsEnum(IAppVersionStatus)
  @IsOptional()
  versionStatus?: IAppVersionStatus;

  /** 快捷筛选：是否只查已发布的应用（等价于 versionStatus = 2） */
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
