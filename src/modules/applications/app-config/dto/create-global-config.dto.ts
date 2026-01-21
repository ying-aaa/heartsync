import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { IAPP_LAYOUT_TYPES, IAppLayoutType } from '@heartsync/types';

/** 全局配置创建DTO */
export class CreateGlobalConfigDto {
  /** 应用ID */
  @IsString()
  @IsOptional() // 整合接口中由应用ID自动填充
  appId?: string;

  /** 版本ID */
  @IsString()
  @IsOptional() // 整合接口中由版本ID自动填充
  versionId?: string;

  /** 应用布局类型 */
  @IsEnum(IAPP_LAYOUT_TYPES, {
    message: `布局类型只能是${IAPP_LAYOUT_TYPES.join('/')}`,
  })
  @IsOptional()
  appLayoutType?: IAppLayoutType = 'default';

  /** 全局容器样式 */
  @IsOptional()
  @ValidateNested({ each: true })
  globalContainerStyle?: {
    backgroundImage: Record<string, string>[];
  } = { backgroundImage: [] };

  /** 自定义全局CSS文本 */
  @IsString()
  @IsOptional()
  customAppGlobalCssText?: string = '';
}
