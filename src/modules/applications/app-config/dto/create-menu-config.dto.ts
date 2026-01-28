import { IsString, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IFileData,
  IMenuItemStyle,
  IMenuLogicConfig,
  IMenuShrinkConfig,
  IWhetherStatus,
} from '@heartsync/types';

/** 菜单样式子DTO */
class MenuItemStyleDto {
  @IsOptional()
  default?: Record<string, string> = {};

  @IsOptional()
  hover?: Record<string, string> = {};

  @IsOptional()
  active?: Record<string, string> = {};
}

class MenuLogoConfig implements IMenuLogicConfig {
  @IsEnum(IWhetherStatus)
  @IsOptional()
  show?: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  url?: IFileData;

  @IsOptional()
  styles?: Record<string, any>;
}

class MenuShrinkConfig implements IMenuShrinkConfig {
  @IsEnum(IWhetherStatus)
  @IsOptional()
  show?: number;

  @IsOptional()
  styles?: Record<string, any>;
}

/** 菜单配置创建DTO */
export class CreateMenuConfigDto {
  /** 应用ID */
  @IsString()
  @IsOptional()
  appId?: string;

  /** 版本ID */
  @IsString()
  @IsOptional()
  versionId?: string;

  /** 父菜单样式 */
  @IsOptional()
  @ValidateNested()
  @Type(() => MenuItemStyleDto)
  parentMenuItemStyle?: IMenuItemStyle = {
    default: {},
    hover: {},
    active: {},
  };

  /** 子菜单样式 */
  @IsOptional()
  @ValidateNested()
  @Type(() => MenuItemStyleDto)
  childMenuItemStyle?: IMenuItemStyle = {
    default: {},
    hover: {},
    active: {},
  };

  /** 菜单容器样式 */
  @IsOptional()
  menuContainerStyle?: Record<string, string> = {};

  /** 选中子菜单时，是否自动选中父元素 */
  @IsEnum(IWhetherStatus)
  @IsOptional()
  isSelectParentWhenChild?: number = 0;

  /** 菜单logo配置 */
  @IsOptional()
  @ValidateNested()
  @Type(() => MenuLogoConfig)
  menuLogoConfig?: IMenuLogicConfig = {} as IMenuLogicConfig;

  @IsOptional()
  @ValidateNested()
  @Type(() => MenuShrinkConfig)
  menuShrinkConfig?: IMenuShrinkConfig = {} as IMenuShrinkConfig;
}
