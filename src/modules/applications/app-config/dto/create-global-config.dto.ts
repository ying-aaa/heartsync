import {
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { IAPP_LAYOUT_TYPES, IAppLayoutType } from '@heartsync/types';
import { Type } from 'class-transformer';

class globalContainerStyle {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  backgroundImage?: [];
}

export class CreateGlobalConfigDto {
  @IsString()
  @IsOptional()
  appId?: string;

  /** 版本ID */
  @IsString()
  @IsOptional()
  versionId?: string;

  @IsEnum(IAPP_LAYOUT_TYPES, {
    message: `布局类型只能是${IAPP_LAYOUT_TYPES.join('/')}`,
  })
  @IsOptional()
  appLayoutType?: IAppLayoutType = 'default';

  @IsOptional()
  @Type(() => globalContainerStyle)
  globalContainerStyle? = { backgroundImage: [] };

  @IsString()
  @IsOptional()
  customAppGlobalCssText?: string = '';
}
