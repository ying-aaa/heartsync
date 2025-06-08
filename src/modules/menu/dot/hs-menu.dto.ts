import {
  IsEnum,
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ExcludeSystemFieldsDto } from 'src/common/dtos/exclude-system.dto';
import { IMenuType } from 'src/database/entities/hs-menu.entity';

export class CreateHsMenuDto extends ExcludeSystemFieldsDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsEnum(IMenuType)
  menuType: IMenuType;

  @IsOptional()
  @IsString()
  parentMenuId?: string;

  @IsBoolean()
  isFullscreen: boolean;

  @IsInt()
  sort: number;

  @IsOptional()
  @IsString()
  dashboardId?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsString()
  appId: string;

  @IsOptional()
  @IsString()
  externalLink?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authRoles?: string[];
}

export class UpdateHsMenuDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsEnum(IMenuType)
  menuType?: IMenuType;

  @IsOptional()
  @IsString()
  parentMenuId?: string;

  @IsOptional()
  @IsBoolean()
  isFullscreen?: boolean;

  @IsOptional()
  @IsInt()
  sort?: number;

  @IsOptional()
  @IsString()
  dashboardId?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  appId?: string;

  @IsOptional()
  @IsString()
  externalLink?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authRoles?: string[];
}

export class BatchUpdateHsMenuDto {
  @IsArray()
  menus: CreateHsMenuDto[];
}

export class ReorderHsMenuDto {
  @IsString()
  parentMenuId: string | null;

  @IsArray()
  @IsString({ each: true })
  orderedIds: string[];
}
