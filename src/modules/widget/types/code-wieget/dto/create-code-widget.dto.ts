import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ICodeWidgetSubTypes, IResourceScript } from '@heartsync/types';
import { BaseWidgetDto } from 'src/modules/widget/widget/dto/base-widget.dto';

export class CreateCodeWidgetDto extends BaseWidgetDto {
  @IsOptional()
  @IsEnum(ICodeWidgetSubTypes, { message: '代码子类型为无效枚举值' })
  subType?: ICodeWidgetSubTypes;

  @IsOptional()
  @IsString({ message: '模板HTML必须为字符串' })
  templateHtml?: string;

  @IsOptional()
  @IsString({ message: '模板CSS必须为字符串' })
  templateCss?: string;

  @IsOptional()
  @IsString({ message: '模板JS必须为字符串' })
  templateJs?: string;

  @IsOptional()
  @IsArray({ message: '模板资源脚本必须为数组' })
  @Type(() => Object)
  resourceScript?: IResourceScript[];
}
