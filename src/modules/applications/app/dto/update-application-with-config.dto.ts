import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGlobalConfigDto } from '../../app-config/dto/create-global-config.dto';
import { CreateMenuConfigDto } from '../../app-config/dto/create-menu-config.dto';
import { CreateHeaderConfigDto } from '../../app-config/dto/create-header-config.dto';

export class UpdateApplicationWithConfigDto {
  /** 应用名称 */
  @IsString()
  @IsOptional()
  name?: string;

  /** 应用描述 */
  @IsString()
  @IsOptional()
  description?: string;

  /** 目录ID */
  @IsString()
  @IsOptional()
  directoryId?: string;

  /** 版本ID（更新指定版本的配置） */
  @IsString()
  @IsOptional()
  versionId?: string;

  /** 全局配置 */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateGlobalConfigDto)
  globalConfig?: Omit<CreateGlobalConfigDto, 'appId' | 'versionId'>;

  /** 菜单配置 */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMenuConfigDto)
  menuConfig?: Omit<CreateMenuConfigDto, 'appId' | 'versionId'>;

  /** 头部配置 */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateHeaderConfigDto)
  headerConfig?: Omit<CreateHeaderConfigDto, 'appId' | 'versionId'>;
}
