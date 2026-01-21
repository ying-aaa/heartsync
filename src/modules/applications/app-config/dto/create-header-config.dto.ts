import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IHeaderContentItemType,
  IHeaderContentItem,
  IHEADER_CONTENT_ITEM_TYPES,
} from '@heartsync/types';

class HeaderContentItemDto {
  @IsEnum(IHEADER_CONTENT_ITEM_TYPES, {
    message: '内容项类型不合法',
  })
  @IsOptional()
  itemType?: IHeaderContentItemType = 'placeholder';

  @IsEnum(['text', 'icon'], { message: '展示类型只能是text/icon' })
  @IsOptional()
  displayType?: 'text' | 'icon' = 'text';

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsOptional()
  itemStyle?: Record<string, string> = {};
}

export class CreateHeaderConfigDto {
  /** 应用ID */
  @IsString()
  @IsOptional()
  appId?: string;

  /** 版本ID */
  @IsString()
  @IsOptional()
  versionId?: string;

  /** 头部容器样式 */
  @IsOptional()
  headerContainerStyle?: Record<string, string> = {};

  /** 头部内容项列表 */
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HeaderContentItemDto)
  headerContentItems?: IHeaderContentItem[] = [];
}
