import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGlobalConfigDto } from '../../app-config/dto/create-global-config.dto';
import { CreateMenuConfigDto } from '../../app-config/dto/create-menu-config.dto';
import { CreateHeaderConfigDto } from '../../app-config/dto/create-header-config.dto';

export class CreateApplicationWithConfigDto {
  /** 应用名称 */
  @IsString()
  @IsNotEmpty({ message: '应用名称不能为空' })
  name: string;

  /** 应用描述 */
  @IsString()
  @IsOptional()
  description?: string;

  /** 应用图标 */
  @IsString()
  @IsOptional()
  imageUrl?: string;

  /** 目录ID */
  @IsString()
  @IsNotEmpty({ message: '目录ID不能为空' })
  directoryId: string;

  /** 初始版本号 */
  @IsString()
  @IsOptional()
  versionCode?: string = 'V1.0.0';

  /** 初始版本名称 */
  @IsString()
  @IsOptional()
  versionName?: string = '初始版本';

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
