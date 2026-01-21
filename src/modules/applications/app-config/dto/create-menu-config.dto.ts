import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IMenuItemStyle } from '@heartsync/types';

/** 菜单样式子DTO */
class MenuItemStyleDto {
  @IsOptional()
  default?: Record<string, string> = {};

  @IsOptional()
  hover?: Record<string, string> = {};

  @IsOptional()
  active?: Record<string, string> = {};
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

  /** 菜单主题ID */
  @IsString()
  @IsOptional()
  menuThemeId?: string = '2';

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
}
