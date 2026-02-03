import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GridsterWidgetConfigDto } from './gridster-widget-config.dto';

export class GridsterConfigDto {
  @IsObject()
  gridsterOption: any = {};

  @ValidateNested({ each: true })
  @Type(() => GridsterWidgetConfigDto)
  gridsterWidget: GridsterWidgetConfigDto[] = [];
}
