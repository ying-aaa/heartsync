import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IHeaderContentItemType,
  IHeaderContentItem,
  IHEADER_CONTENT_ITEM_TYPES,
} from '@heartsync/types';

class HeaderContentItemDto implements IHeaderContentItem {
  @IsEnum(IHEADER_CONTENT_ITEM_TYPES, {
    message: '内容项类型不合法',
  })
  @IsOptional()
  type: IHeaderContentItemType = 'placeholder';

  @IsOptional()
  styles?: {
    [key: string]: string;
  };
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
