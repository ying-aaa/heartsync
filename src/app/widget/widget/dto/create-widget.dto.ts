import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { WidgetType } from '../../entities/widget.entity';

export class CreateWidgetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(WidgetType)
  @IsNotEmpty()
  type: WidgetType;

  @IsString()
  @IsNotEmpty()
  appId: string;

  @IsString()
  @IsOptional()
  nodeId: string;

  @IsOptional()
  generalConfig?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean;
}
