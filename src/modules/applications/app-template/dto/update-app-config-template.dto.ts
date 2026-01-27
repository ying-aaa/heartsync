import { PartialType } from '@nestjs/mapped-types';
import { CreateAppConfigTemplateDto } from './create-app-config-template.dto';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

/**
 * 更新应用配置模板DTO
 */
export class UpdateAppConfigTemplateDto extends PartialType(
  CreateAppConfigTemplateDto,
) {
  /** 模板ID（UUID） */
  @IsUUID('4', { message: '模板ID必须为合法的UUID' })
  @IsString({ message: '模板ID必须为字符串' })
  @IsNotEmpty({ message: '模板ID不能为空' })
  id: string;
}
