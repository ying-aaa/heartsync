import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';
import { WidgetType } from 'src/database/entities/hs-widget.entity';

export class QueryWidgetDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  appId: string;

  @IsString()
  type: WidgetType;
}
