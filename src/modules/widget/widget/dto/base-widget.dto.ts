import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IWidgetType } from '@heartsync/types';

export class BaseWidgetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(IWidgetType)
  @IsNotEmpty()
  type: IWidgetType;

  @IsString()
  @IsNotEmpty()
  appId: string;

  @IsOptional()
  @IsObject({ message: '部件设置必须为JSON对象' })
  @Type(() => Object)
  settings?: Record<string, any>;
}
