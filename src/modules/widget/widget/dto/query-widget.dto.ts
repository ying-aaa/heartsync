import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IWidgetType } from '@heartsync/types';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';

export class QueryWidgetDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(IWidgetType)
  @IsNotEmpty()
  type: IWidgetType;

  @IsString()
  @IsNotEmpty()
  appId: string;
}
