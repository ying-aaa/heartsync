import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsNumber,
  IsJSON,
} from 'class-validator';
import {
  IAPP_TEMPLATE_TYPES,
  IAppTemplateType,
  IWhetherStatus,
} from '@heartsync/types';

/**
 * 创建应用配置模板DTO
 * 用于接口入参校验，保证数据合法性
 */
export class CreateAppConfigTemplateDto {
  /** 模板名称 */
  @IsString({ message: '模板名称必须为字符串' })
  @IsNotEmpty({ message: '模板名称不能为空' })
  @MaxLength(100, { message: '模板名称长度不能超过100个字符' })
  templateName: string;

  /** 模板类型 */
  @IsEnum(IAPP_TEMPLATE_TYPES, { message: '模板类型只能是system或user' })
  @IsOptional()
  templateType?: IAppTemplateType = 'system';

  /** 关联应用ID */
  @IsString({ message: '应用ID必须为字符串' })
  @IsOptional()
  appId?: string;

  /** 创建人ID */
  @IsString({ message: '创建人ID必须为字符串' })
  @IsNotEmpty({ message: '创建人ID不能为空' })
  @MaxLength(64, { message: '创建人ID长度不能超过64个字符' })
  creatorId: string;

  /** 是否默认模板 */
  @IsNumber({}, { message: '是否默认模板必须为数字' })
  @IsOptional()
  isDefault?: IWhetherStatus = 0;

  /** 模板备注 */
  @IsString({ message: '模板备注必须为字符串' })
  @MaxLength(500, { message: '模板备注长度不能超过500个字符' })
  @IsOptional()
  remark?: string;

  /** 全局配置（JSON字符串/对象） */
  @IsOptional()
  @IsJSON({ message: '全局配置必须为合法的JSON格式' })
  appGlobalConfig?: string;

  /** 头部配置（JSON字符串/对象） */
  @IsOptional()
  @IsJSON({ message: '头部配置必须为合法的JSON格式' })
  appHeaderConfig?: string;

  /** 菜单配置（JSON字符串/对象） */
  @IsOptional()
  @IsJSON({ message: '菜单配置必须为合法的JSON格式' })
  appMenuConfig?: string;
}
