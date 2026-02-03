import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWidgetDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsObject({ message: '部件设置必须为JSON对象' })
  @Type(() => Object)
  settings?: Record<string, any>;
}
